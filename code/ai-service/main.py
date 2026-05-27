import os
import asyncio
import tempfile
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bullmq import Worker, Queue
from utils import audio
from utils.demucs_separator import separate_stems

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="StemVerse AI Service")

class AnalyzeRequest(BaseModel):
    songId: str
    fileUrl: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "StemVerse AI Service"}

@app.post("/analyze")
def analyze_audio(request: AnalyzeRequest):
    try:
        # fileUrl here is the S3 object key from R2
        result = audio.process_audio_analysis(request.fileUrl, request.songId)
        return {
            "songId": request.songId,
            "bpm": result["bpm"],
            "key": result["key"],
            "duration": result["duration"],
            "waveform": result["waveform"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Redis config for BullMQ
REDIS_HOST = os.environ.get("REDIS_HOST", "redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
redis_connection = {"host": REDIS_HOST, "port": REDIS_PORT}

async def process_analysis_job(job, job_token):
    song_id = job.data.get("songId")
    file_key = job.data.get("fileUrl") # R2 key
    logger.info(f"Starting async processing for song {song_id}")
    
    # Initialize Queue to send results back to NestJS
    result_queue = Queue("analysis-completed", {"connection": redis_connection})
    
    temp_original_path = None
    try:
        s3 = audio.get_s3_client()
        bucket_name = os.environ.get('STORAGE_BUCKET_NAME')
        
        # 1. Download original file to temp for stem separation
        suffix = "." + file_key.split(".")[-1] if "." in file_key else ".tmp"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            temp_original_path = tmp_file.name
        s3.download_file(bucket_name, file_key, temp_original_path)
        
        # 2. Run audio analysis (BPM, Key, Duration, Waveform)
        analysis_result = audio.process_audio_analysis(file_key, song_id)
        
        # 3. Separate Stems (Vocals, Drums, Bass, Other) running in a separate thread
        with tempfile.TemporaryDirectory() as temp_dir:
            stems_paths = await asyncio.to_thread(separate_stems, temp_original_path, temp_dir)
            
            # 4. Upload stems to R2 and map keys
            stems_r2_keys = {}
            for stem_type, path in stems_paths.items():
                # Define key format: songs/<songId>/stems/<stem_type>.wav
                stem_key = f"songs/{song_id}/stems/{stem_type}.wav"
                s3.upload_file(path, bucket_name, stem_key)
                stems_r2_keys[stem_type] = stem_key
                
        # 5. Send success payload back to NestJS
        payload = {
            "songId": song_id,
            "status": "success",
            "bpm": analysis_result["bpm"],
            "key": analysis_result["key"],
            "duration": analysis_result["duration"],
            "waveform": analysis_result["waveform"],
            "stems": stems_r2_keys
        }
        await result_queue.add("analysis-success", payload)
        logger.info(f"Successfully processed song {song_id} and enqueued result")
        
    except Exception as e:
        logger.error(f"Error processing song {song_id}: {str(e)}")
        payload = {
            "songId": song_id,
            "status": "failed",
            "error": str(e)
        }
        await result_queue.add("analysis-failed", payload)
    finally:
        # Clean up temp original file
        if temp_original_path and os.path.exists(temp_original_path):
            try:
                os.remove(temp_original_path)
            except Exception as cleanup_err:
                logger.warning(f"Failed to clean up temp file {temp_original_path}: {cleanup_err}")
        await result_queue.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the BullMQ worker
    worker = Worker(
        "audio-analysis",
        process_analysis_job,
        {"connection": redis_connection}
    )
    logger.info("BullMQ Worker started, listening to 'audio-analysis' queue...")
    yield
    # Clean up the worker
    await worker.close()
    logger.info("BullMQ Worker shut down.")

# Assign lifespan
app.router.lifespan_context = lifespan
