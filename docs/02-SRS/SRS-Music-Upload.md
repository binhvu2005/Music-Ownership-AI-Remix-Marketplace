---
title: SRS — Music Upload System
type: spec
project: StemVerse
module: music-upload
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - upload
  - music
---

# SRS — Music Upload System

## Problem

Creator cần upload nhạc gốc lên StemVerse một cách an toàn, nhanh chóng, kèm metadata đầy đủ và khả năng AI phân tích tự động.

## Goal

Xây dựng hệ thống upload nhạc:
- Hỗ trợ full track + stems
- Chunked upload cho file lớn
- Metadata form đầy đủ
- License configuration
- Tích hợp với AI Analysis pipeline

## Scope

**In scope:**
- Upload full track (`.mp3`, `.wav`, `.flac`)
- Upload stems (tối đa 8 files)
- Chunked upload + resume
- Metadata input form
- License type configuration
- Progress indicator
- Waveform preview sau upload

**Out of scope:**
- Real-time collaborative upload
- Mobile upload (Phase 3)

## User Flow

Xem [[Flow-Upload-Music]]

## Technical Design

### Upload Strategy
- **Chunked Upload**: File chia thành 5MB chunks
- **Storage**: Cloudflare R2 (primary), presigned URLs
- **Deduplication**: SHA-256 hash check trước upload

### File Validation
```
Max size: 500MB per file
Formats: .mp3, .wav, .flac, .aiff
Min duration: 30 seconds
Max duration: 20 minutes
Max stems: 8 per track
BPM range: 1–300
```

### Upload Flow (Technical)
```
1. Client requests presigned upload URL from API
2. API validates file metadata → creates upload session
3. Client uploads directly to R2 via presigned URL (chunked)
4. Client notifies API of completion
5. API queues AI processing jobs
6. API returns song_id + processing status
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/music/upload/init` | Creator | Khởi tạo upload session |
| GET | `/music/upload/:sessionId/url` | Creator | Lấy presigned URL |
| POST | `/music/upload/:sessionId/complete` | Creator | Báo upload xong |
| POST | `/music/songs` | Creator | Tạo song record với metadata |
| PUT | `/music/songs/:id` | Creator | Update song metadata |
| DELETE | `/music/songs/:id` | Creator | Xóa song |
| GET | `/music/songs/:id/status` | Creator | Check processing status |
| GET | `/music/songs/:id/waveform` | Public | Lấy waveform data |
| POST | `/music/songs/:id/stems` | Creator | Upload thêm stems |

## Database

```sql
-- songs table
id              UUID PRIMARY KEY
owner_id        UUID REFERENCES users(id)
title           VARCHAR(255) NOT NULL
genre           VARCHAR(50)
bpm             INTEGER
key             VARCHAR(10)    -- e.g., "C#m", "F major"
mood            VARCHAR(50)
tags            TEXT[]
lyrics          TEXT
instruments     TEXT[]
vocal_type      VARCHAR(50)
file_url        TEXT NOT NULL   -- R2 URL
waveform_data   JSONB           -- peaks/svg data
duration        INTEGER         -- seconds
license_type    ENUM('personal','commercial','remix','exclusive')
remix_allowed   BOOLEAN DEFAULT true
commercial_allowed BOOLEAN DEFAULT true
ai_voice_cloning_allowed BOOLEAN DEFAULT false
royalty_split_remixer   DECIMAL(5,2) DEFAULT 20.00
royalty_split_platform  DECIMAL(5,2) DEFAULT 10.00
processing_status ENUM('queued','processing','done','failed')
is_published    BOOLEAN DEFAULT false
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP

-- stems table
id          UUID PRIMARY KEY
song_id     UUID REFERENCES songs(id)
type        ENUM('vocals','drums','bass','synth','guitar','piano','melody','other')
file_url    TEXT NOT NULL
duration    INTEGER
created_at  TIMESTAMP DEFAULT NOW()
```

## Edge Cases

| Case | Handling |
|------|---------|
| Upload bị ngắt giữa chừng | Resume từ chunk cuối cùng |
| File bị corrupt | Detect sau upload, notify user |
| Duplicate file (same hash) | Warn user: "This file already exists" |
| AI processing fail | Notify user, allow manual retry |
| User xóa bài đang được license | Block xóa, yêu cầu cancel licenses |

## Acceptance Criteria

- [ ] Upload file lên đến 500MB thành công
- [ ] Chunked upload resume khi mất kết nối
- [ ] Metadata form validate đúng (title required, BPM range, valid key)
- [ ] AI processing queue nhận job sau khi upload complete
- [ ] Waveform data available sau 30 giây
- [ ] Song xuất hiện trong search sau publish
- [ ] Creator không thể delete song đang có active licenses

## Related

- [[Flow-Upload-Music]]
- [[SRS-AI-Analysis]]
- [[API-Music]]
- [[Table-Songs]]
- [[Table-Stems]]
- [[ADR-006-Cloudflare-R2-Storage]]
