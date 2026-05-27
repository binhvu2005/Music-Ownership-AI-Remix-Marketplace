from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import audio

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
