import sys
from unittest.mock import MagicMock

# Mock heavy dependencies before importing main
sys.modules['boto3'] = MagicMock()
sys.modules['librosa'] = MagicMock()
sys.modules['numpy'] = MagicMock()

from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_analyze_endpoint_missing_body():
    # Calling POST /analyze with empty body should return 422
    response = client.post("/analyze", json={})
    assert response.status_code == 422

def test_analyze_endpoint_success(monkeypatch):
    # Mock the internal audio analysis helper so we don't download from R2 or run Librosa in unit tests
    from utils import audio
    
    mock_result = {
        "bpm": 120.0,
        "key": "Am",
        "duration": 180,
        "waveform": [0.01, 0.05, 0.1, 0.05, 0.01]
    }
    
    # Apply mock using monkeypatch
    monkeypatch.setattr(audio, "process_audio_analysis", lambda file_url, song_id: mock_result)
    
    response = client.post(
        "/analyze",
        json={
            "songId": "song-uuid",
            "fileUrl": "songs/song-uuid/test.mp3"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["songId"] == "song-uuid"
    assert data["bpm"] == 120.0
    assert data["key"] == "Am"
    assert data["duration"] == 180
    assert isinstance(data["waveform"], list)
