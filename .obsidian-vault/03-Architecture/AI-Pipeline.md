---
title: AI Processing Pipeline
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - ai
  - pipeline
---

# AI Processing Pipeline

## Upload Pipeline

```
[User Upload Song]
        ↓
[music-service] Store original file to R2
        ↓
[music-service] Create song record (status: queued)
        ↓
[BullMQ] Publish jobs to audio-analysis queue:
        ├── Job 1: generate-waveform
        ├── Job 2: detect-bpm-key
        └── Job 3: stem-separation
        ↓
[ai-service FastAPI Worker] Process in parallel:
        │
        ├── [generate-waveform]
        │     FFmpeg → extract audio peaks
        │     → store as JSON in PostgreSQL
        │
        ├── [detect-bpm-key]
        │     Librosa beat_track() → BPM
        │     Librosa chromagram → Key
        │     → update song_analysis table
        │
        └── [stem-separation]
              Demucs HTDemucs model
              → vocals.wav, drums.wav, bass.wav, other.wav
              → upload stems to R2
              → create stems records in DB
        ↓
[ai-service] All jobs done?
        ↓
[music-service] Update song.processing_status = 'done'
        ↓
[notification-service] Notify creator via WebSocket + Email
```

## Remix Pipeline

```
[User submits Remix Request]
        ↓
[api-service] Validate:
  - song.remix_allowed = true
  - user has remix credits
        ↓
[ai-service] Create remix job
        ↓
[BullMQ] Publish to ai-remix queue
        ↓
[ai-service FastAPI Worker] Process:
        │
        ├── Load stems from R2 (vocals, drums, bass, other)
        │
        ├── Parse remix prompt → operations:
        │     style: "dark phonk"
        │     tempo: +5 BPM
        │     pitch: -2 semitones
        │     fx: [distortion, bass_boost]
        │
        ├── Apply tempo shift (Librosa time_stretch)
        ├── Apply pitch shift (Librosa pitch_shift)
        ├── Apply style transfer (MusicGen conditioning)
        ├── Apply FX (Pedalboard effects chain)
        └── Mix down to output.wav
        ↓
[ai-service] Upload remix output to R2
        ↓
[ai-service] Generate remix waveform
        ↓
[ai-service] Update remix_job.status = 'preview_ready'
        ↓
[notification-service] Notify remixer: "Preview ready!"
        ↓
[User] Preview and choose to publish
        ↓
[music-service] Create song record for remix
[ownership-service] Create ownership_relations record
[notification-service] Notify original creator
```

## Queue Architecture

```
Redis Queue (BullMQ):
├── audio-analysis
│   ├── generate-waveform    (priority: high)
│   ├── detect-bpm-key       (priority: high)
│   └── stem-separation      (priority: medium)
│
├── ai-remix
│   ├── priority: user-type (premium > free)
│   └── concurrency: 2 per GPU worker
│
└── notifications
    ├── email                (priority: normal)
    └── websocket            (priority: high)
```

## GPU Resource Management

```
AI Service Workers:
├── Worker Type A: Audio Analysis (CPU-only)
│   - Waveform generation
│   - BPM/Key detection
│   - Concurrency: unlimited
│
└── Worker Type B: AI Model (GPU-required)
    - Stem separation (Demucs)
    - Style transfer (MusicGen)
    - Concurrency: 1-2 per GPU
    - Auto-scale on Modal/RunPod
```

## Error Handling & Retry Policy

| Job Type | Max Retries | Backoff | On Final Fail |
|---------|-------------|---------|--------------|
| generate-waveform | 3 | exponential | Mark failed, notify |
| detect-bpm-key | 3 | exponential | Mark failed |
| stem-separation | 2 | 5min fixed | Fallback to Spleeter |
| ai-remix | 2 | 10min fixed | Mark failed, notify |

## Processing Time SLAs

| Task | Target | Max Acceptable |
|------|--------|---------------|
| Waveform ready | 30s | 2 min |
| BPM/Key ready | 30s | 2 min |
| Stems ready | 3 min | 10 min |
| AI Remix | 2 min | 10 min |

## Related

- [[System-Architecture]]
- [[SRS-AI-Analysis]]
- [[SRS-AI-Remix-Engine]]
- [[ADR-003-FastAPI-AI-Service]]
- [[ADR-007-Demucs-Stem-Separation]]
- [[ADR-005-Redis-Cache-Queue]]
