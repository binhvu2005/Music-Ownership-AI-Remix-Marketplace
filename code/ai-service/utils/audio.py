import os
import boto3
import librosa
import numpy as np
import tempfile

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=os.environ.get('STORAGE_ENDPOINT'),
        aws_access_key_id=os.environ.get('STORAGE_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('STORAGE_SECRET_ACCESS_KEY'),
        region_name='auto'
    )

def process_audio_analysis(file_key: str, song_id: str) -> dict:
    s3 = get_s3_client()
    bucket_name = os.environ.get('STORAGE_BUCKET_NAME')
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_file:
        temp_path = tmp_file.name
        
    try:
        # Download file from Cloudflare R2
        s3.download_file(bucket_name, file_key, temp_path)
        
        # Load audio using librosa (uses soundfile / ffmpeg under the hood)
        y, sr = librosa.load(temp_path, sr=22050)
        
        # 1. BPM and Duration
        duration = int(librosa.get_duration(y=y, sr=sr))
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo[0]) if isinstance(tempo, (list, tuple, np.ndarray)) else float(tempo)
        
        # 2. Key Detection using Chroma
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        chroma_sum = chroma.sum(axis=1)
        pitch_class = chroma_sum.argmax()
        
        # Simple mapping (major scales for simplicity)
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        detected_key = keys[pitch_class]
        
        # 3. Waveform generation (extract 150 points)
        target_points = 150
        if len(y) > target_points:
            samples_per_point = len(y) // target_points
            waveform = [float(np.abs(y[i*samples_per_point:(i+1)*samples_per_point]).mean()) for i in range(target_points)]
        else:
            waveform = [float(np.abs(val)) for val in y]
            
        # Normalize waveform between 0 and 1
        max_val = max(waveform) if waveform else 1
        if max_val > 0:
            waveform = [round(v / max_val, 3) for v in waveform]
        else:
            waveform = [0.0] * len(waveform)
        
        return {
            "bpm": round(bpm, 2),
            "key": detected_key,
            "duration": duration,
            "waveform": waveform
        }
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
