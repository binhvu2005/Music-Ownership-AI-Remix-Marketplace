---
title: Flow — Upload Music
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - flow
  - upload
  - creator
---

# Flow — Upload Music (Creator)

## Mục tiêu

Cho phép Original Creator upload bài nhạc gốc cùng stems và metadata lên StemVerse.

---

## User Flow

```
[Creator] Login
     ↓
[Creator] Vào trang Upload
     ↓
[Creator] Chọn loại upload:
     ├── Full Track (.mp3 / .wav)
     └── Full Track + Stems
     ↓
[Creator] Kéo thả / chọn file
     ↓
[System] Validate file format & size
     ↓     (nếu lỗi → show error message)
[System] Upload to Cloudflare R2
     ↓
[System] Chạy AI Analysis pipeline:
     ├── Generate Waveform
     ├── Stem Separation (Demucs)
     ├── BPM Detection (Librosa)
     ├── Key Detection
     └── Chorus/Hook Detection
     ↓
[Creator] Fill metadata form:
     ├── Required: title, genre, BPM, key, mood
     └── Optional: tags, lyrics, instruments, vocal_type
     ↓
[Creator] Cấu hình License:
     ├── License Type (Personal/Commercial/Remix/Exclusive)
     ├── Remix Allowed? (toggle)
     ├── Commercial Use Allowed? (toggle)
     ├── AI Voice Cloning Allowed? (toggle)
     └── Revenue Sharing % (default: Remixer 20%, Platform 10%)
     ↓
[Creator] Preview waveform + metadata
     ↓
[Creator] Click "Publish"
     ↓
[System] Tạo ownership record (owner = creator)
     ↓
[System] Index vào search engine (Meilisearch)
     ↓
[System] Gửi notification: "Your track is live!"
     ↓
[Creator] Redirect về track detail page
```

---

## File Validation Rules

| Field | Rule |
|-------|------|
| Format | `.mp3`, `.wav`, `.flac` |
| Max size | 500 MB per file |
| Max stems | 8 stems per track |
| Metadata | title required, BPM 1–300, key must be valid musical key |

---

## AI Processing Pipeline (async)

Sau khi upload, processing chạy **background queue** (BullMQ + Redis):

1. `generate-waveform` job → tạo SVG/JSON waveform data
2. `stem-separation` job → Demucs tách stems
3. `detect-metadata` job → Librosa BPM + key detection
4. `chorus-detection` job → xác định hook/drop positions
5. `create-ownership-record` job → tạo ownership node

---

## Error Cases

| Error | Handling |
|-------|---------|
| File format không hợp lệ | Show error, không upload |
| File quá lớn | Show size limit error |
| Network timeout | Retry upload (chunked upload) |
| AI processing fail | Notify user, có thể retry |
| Duplicate song detected | Warning: "Similar track found" |

---

## Acceptance Criteria

- [ ] Creator upload được `.mp3` và `.wav` file
- [ ] Validation xảy ra **trước** khi upload lên R2
- [ ] AI analysis chạy async, không block UI
- [ ] Waveform hiển thị trong vòng 30 giây sau upload
- [ ] Stems được tách và accessible sau 2–5 phút
- [ ] Ownership record được tạo ngay sau publish
- [ ] Track xuất hiện trong search sau 1 phút

---

## Related

- [[SRS-Music-Upload]]
- [[SRS-AI-Analysis]]
- [[API-Music]]
- [[Table-Songs]]
- [[Table-Stems]]
- [[ADR-006-Cloudflare-R2-Storage]]
- [[ADR-007-Demucs-Stem-Separation]]
