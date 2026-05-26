---
title: SRS — AI Remix Engine
type: spec
project: StemVerse
module: ai-remix-engine
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - ai
  - remix
---

# SRS — AI Remix Engine

## Problem

Remixer cần công cụ AI mạnh mẽ để tạo derivative tracks từ bài gốc mà không cần kỹ năng âm nhạc chuyên sâu. Đồng thời cần tự động hóa ownership và royalty tracking.

## Goal

Xây dựng AI Remix Engine:
- Nhận text prompt → generate derivative track
- Hỗ trợ: style transfer, tempo shift, pitch shift, FX layering
- Real-time preview trong Remix Studio
- Tự động tạo ownership record sau publish

## Scope

**In scope:**
- AI Remix từ text prompt
- Tempo shift (BPM adjustment)
- Pitch shift (semitone adjustment)
- Vocal transformation (keep/remove/modify)
- FX layering (reverb, distortion, bass boost)
- Manual stem editor (kéo thả)
- Preview trước khi publish

**Out of scope:**
- Real-time AI remix (Phase 2+)
- Voice cloning (Phase 2)
- Full AI generation from scratch (Phase 3)

## User Flow

Xem [[Flow-AI-Remix]]

## Technical Design

### AI Remix Architecture

```
[Remix Request]
    ↓
[API Gateway] Validate:
  - song.remix_allowed = true
  - user has remix quota (credits)
    ↓
[BullMQ Queue: ai-remix]
    ↓
[FastAPI AI Worker]
    ↓
  Load stems từ R2:
  ├── vocals.wav
  ├── drums.wav
  └── bass.wav + other.wav
    ↓
  Parse remix prompt → extract operations:
  ├── style: "dark phonk"
  ├── tempo: +10 BPM
  ├── pitch: -2 semitones
  └── fx: [distortion, bass_boost]
    ↓
  Apply operations:
  ├── [Tempo] Librosa time_stretch
  ├── [Pitch] Librosa pitch_shift
  ├── [Style] MusicGen conditioning
  └── [FX] Pedalboard effects chain
    ↓
  Mix stems → output.wav
    ↓
  Upload to R2
    ↓
[Return]: remix_url + metadata
```

### Supported Prompt Styles

| Style | Examples |
|-------|---------|
| Dark Phonk | "dark phonk", "russian phonk" |
| Anime | "anime opening", "j-pop", "jpop" |
| Synthwave | "synthwave", "retrowave", "80s" |
| Lofi | "lofi", "chill lofi", "lofi hip hop" |
| Drill | "uk drill", "ny drill" |
| Trap | "trap", "hard trap" |
| Ambient | "ambient", "atmospheric" |

### FX Chain (Pedalboard)

```python
effects = {
    "reverb": Reverb(room_size=0.7),
    "distortion": Distortion(drive_db=25),
    "bass_boost": LowShelfFilter(cutoff_hz=200, gain_db=6),
    "delay": Delay(delay_seconds=0.3, mix=0.3),
    "chorus": Chorus(rate_hz=1.5)
}
```

### AI Models

| Task | Model | VRAM |
|------|-------|------|
| Style Transfer | MusicGen-small | 4GB |
| Style Transfer (premium) | MusicGen-large | 16GB |
| Fallback | Librosa only | CPU |

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/ai/remix` | Remixer | Tạo remix job |
| GET | `/ai/remix/:jobId/status` | Remixer | Check job status |
| GET | `/ai/remix/:jobId/preview` | Remixer | Get preview URL |
| POST | `/ai/remix/:jobId/publish` | Remixer | Publish remix → tạo ownership |
| GET | `/ai/remix/styles` | Public | Danh sách supported styles |
| DELETE | `/ai/remix/:jobId` | Remixer | Hủy/xóa pending job |

### POST /ai/remix — Request Body

```json
{
  "song_id": "uuid",
  "prompt": "Convert to dark phonk",
  "options": {
    "tempo_shift": +5,
    "pitch_shift": -2,
    "vocal_mode": "keep",
    "fx": ["distortion", "bass_boost"],
    "style": "dark_phonk"
  }
}
```

### POST /ai/remix — Response

```json
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_time_seconds": 120,
  "queue_position": 3
}
```

## Database

```sql
-- remix_jobs table
id              UUID PRIMARY KEY
song_id         UUID REFERENCES songs(id)
creator_id      UUID REFERENCES users(id)
remix_prompt    TEXT NOT NULL
options         JSONB               -- tempo_shift, pitch_shift, fx, style
status          ENUM('queued','processing','preview_ready','published','failed')
preview_url     TEXT
output_url      TEXT
processing_time INTEGER
error_msg       TEXT
created_at      TIMESTAMP DEFAULT NOW()

-- remixes table (sau khi publish)
id                  UUID PRIMARY KEY
parent_song_id      UUID REFERENCES songs(id)
creator_id          UUID REFERENCES users(id)
remix_job_id        UUID REFERENCES remix_jobs(id)
song_id             UUID REFERENCES songs(id)   -- remix cũng là song
ownership_split     JSONB   -- {creator: 70, remixer: 20, platform: 10}
remix_prompt        TEXT
created_at          TIMESTAMP DEFAULT NOW()
```

## Edge Cases

| Case | Handling |
|------|---------|
| Song không có stems | Dùng full track, AI quality thấp hơn |
| GPU queue full | Queue waiting, show ETA |
| Style không recognized | Default style transfer |
| Output quality thấp | Allow retry với different options |
| User cancel khi đang process | Cancel job, không charge credits |
| Free user hết credits | Show upgrade prompt |

## Acceptance Criteria

- [ ] Remix job tạo thành công với valid prompt
- [ ] Processing status update real-time
- [ ] Preview audio available sau khi processing xong
- [ ] User có thể retry với options khác trước khi publish
- [ ] Publish tạo đúng ownership_relations record
- [ ] Original creator nhận notification khi remix published
- [ ] Free user limit: 5 remixes/hour; Premium: 50/hour

## Related

- [[Flow-AI-Remix]]
- [[SRS-AI-Analysis]]
- [[SRS-Ownership-Graph]]
- [[API-AI]]
- [[Table-Remixes]]
- [[ADR-003-FastAPI-AI-Service]]
- [[AI-Pipeline]]
