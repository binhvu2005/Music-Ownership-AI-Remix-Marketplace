---
title: SRS — AI Audio Analysis
type: spec
project: StemVerse
module: ai-analysis
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - ai
  - audio-analysis
---

# SRS — AI Audio Analysis

## Problem

Sau khi Creator upload nhạc, hệ thống cần tự động phân tích audio để extract metadata (BPM, key, stems) mà không cần Creator thao tác thủ công.

## Goal

Xây dựng AI Audio Analysis pipeline:
- Tách stems (vocals, drums, bass, instruments)
- Detect BPM chính xác
- Detect musical key
- Detect chorus/hook positions
- Generate waveform visualization
- Chạy hoàn toàn async (không block UI)

## Scope

**In scope:**
- Stem separation (Demucs / Spleeter)
- BPM detection (Librosa)
- Key detection (Librosa)
- Chorus/drop detection
- Waveform generation (peaks data + SVG)
- Background queue processing

**Out of scope:**
- Real-time processing (Phase 2+)
- Genre detection (Phase 2)
- Lyrics transcription (Phase 2)

## Technical Design

### Pipeline Architecture

```
[Upload Complete Event]
        ↓
[BullMQ Queue: audio-analysis]
        ↓
[FastAPI Worker] Pick job
        ↓
┌─────────────────────────────────┐
│       PARALLEL PROCESSING       │
│  ┌──────────┐  ┌─────────────┐ │
│  │ Waveform │  │   Metadata  │ │
│  │  (FFmpeg)│  │  Detection  │ │
│  └──────────┘  │  (Librosa)  │ │
│                └─────────────┘ │
└─────────────────────────────────┘
        ↓
[Stem Separation - Demucs]
(nặng nhất, chạy sau)
        ↓
[Update song record in PostgreSQL]
        ↓
[Publish: processing_complete event]
        ↓
[Notify Creator via WebSocket/Email]
```

### Technologies

| Task | Library | Model |
|------|---------|-------|
| Stem Separation | Demucs (primary) | HTDemucs |
| Stem Separation (fallback) | Spleeter | 4-stem / 5-stem |
| BPM Detection | Librosa | `beat_track()` |
| Key Detection | Librosa | `estimate_tuning()` + chromagram |
| Waveform | FFmpeg | `ffmpeg -i input.mp3 -filter:a aformat` |
| Chorus Detection | Librosa | `segment` module |

### Stem Types

| Stem | File | Size (estimate) |
|------|------|----------------|
| Vocals | `vocals.wav` | ~30% of original |
| Drums | `drums.wav` | ~15% |
| Bass | `bass.wav` | ~15% |
| Other/Instruments | `other.wav` | ~40% |

### Processing Time Estimates

| Task | Time (3-min song) |
|------|------------------|
| Waveform generation | 5–10 seconds |
| BPM + Key detection | 5–15 seconds |
| Stem separation (Demucs) | 1–3 minutes |
| Total | ~2–5 minutes |

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/ai/analysis/:songId/status` | Creator | Lấy processing status |
| GET | `/ai/analysis/:songId/results` | Creator | Lấy analysis results |
| POST | `/ai/analysis/:songId/retry` | Creator | Retry failed analysis |
| GET | `/ai/waveform/:songId` | Public | Lấy waveform peaks data |

## Database

```sql
-- song_analysis table
id              UUID PRIMARY KEY
song_id         UUID REFERENCES songs(id) UNIQUE
bpm             DECIMAL(6,2)
bpm_confidence  DECIMAL(4,2)    -- 0.0–1.0
key             VARCHAR(10)
key_confidence  DECIMAL(4,2)
chorus_start    INTEGER[]        -- timestamps (seconds)
chorus_end      INTEGER[]
waveform_peaks  JSONB            -- array of amplitude values
processing_time INTEGER          -- milliseconds
created_at      TIMESTAMP DEFAULT NOW()

-- processing_jobs table
id          UUID PRIMARY KEY
song_id     UUID REFERENCES songs(id)
job_type    ENUM('waveform','bpm_key','stem_separation','chorus')
status      ENUM('queued','processing','done','failed')
error_msg   TEXT
started_at  TIMESTAMP
completed_at TIMESTAMP
```

## Edge Cases

| Case | Handling |
|------|---------|
| Audio quá ngắn (<30s) | Skip chorus detection, warn user |
| Audio chứa nhiều tempo changes | Detect dominant BPM |
| Instrument-only track (no vocals) | vocals.wav sẽ trống/silence |
| Demucs fail (GPU OOM) | Fallback sang Spleeter |
| Song ở format không chuẩn | FFmpeg normalize trước khi process |
| Job timeout sau 15 phút | Mark as failed, notify |

## Acceptance Criteria

- [ ] BPM detected trong vòng 30 giây sau upload
- [ ] Key detected trong vòng 30 giây sau upload
- [ ] Stems available trong vòng 5 phút (bài 3 phút)
- [ ] Waveform peaks data ready trong 30 giây
- [ ] Processing status websocket update real-time
- [ ] Failed jobs có thể retry
- [ ] Demucs fallback sang Spleeter khi fail

## Related

- [[SRS-Music-Upload]]
- [[SRS-AI-Remix-Engine]]
- [[API-AI]]
- [[ADR-007-Demucs-Stem-Separation]]
- [[AI-Pipeline]]
