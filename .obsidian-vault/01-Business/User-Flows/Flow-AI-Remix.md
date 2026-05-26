---
title: Flow — AI Remix
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - flow
  - remix
  - ai
---

# Flow — AI Remix (Remixer)

## Mục tiêu

Cho phép Remixer tạo derivative track bằng AI Remix Engine, với ownership split tự động.

---

## User Flow

```
[Remixer] Browse/Search bài nhạc
     ↓
[Remixer] Chọn bài có "Remix Allowed" badge
     ↓
[Remixer] Click "Remix This Track"
     ↓
[System] Check: remix_allowed = true?
     ├── NO → "This track does not allow remixing"
     └── YES → Mở Remix Studio
     ↓
[Remix Studio] Hiển thị:
     ├── Original waveform
     ├── Available stems (vocals, drums, bass, ...)
     └── AI Remix Prompt input
     ↓
[Remixer] Chọn mode:
     ├── AI Remix (nhập prompt)
     └── Manual Stem Edit (kéo/thả)
     ↓
     === AI REMIX MODE ===
     ↓
[Remixer] Nhập prompt:
     "Convert this song into dark phonk"
     ↓
[Remixer] Configure AI options:
     ├── Tempo Shift (BPM adjustment)
     ├── Pitch Shift (semitones)
     ├── Vocal Transformation (keep/transform/remove)
     └── FX: reverb / distortion / bass boost
     ↓
[Remixer] Click "Generate Remix"
     ↓
[System] Gửi vào AI Remix Queue (BullMQ)
     ↓
[AI Service - FastAPI] Process:
     ├── Load original stems từ R2
     ├── Apply style transfer (MusicGen/PyTorch)
     ├── Apply tempo/pitch shift (Librosa)
     ├── Apply FX (Pedalboard)
     └── Mix down to final track
     ↓
[System] Upload remix to R2
     ↓
[System] Generate waveform for remix
     ↓
[Remixer] Preview remix audio
     ↓
[Remixer] Satisfied? 
     ├── NO → Adjust prompt, regenerate
     └── YES → Tiếp tục
     ↓
[System] Hiển thị Ownership Split Preview:
     ├── Original Creator: 70%
     ├── Remixer (you): 20%
     └── Platform: 10%
     ↓
[Remixer] Review và Accept ownership split
     ↓
[Remixer] Add remix metadata:
     ├── Remix title
     ├── Description
     └── Tags
     ↓
[Remixer] Click "Publish Remix"
     ↓
[System] Tạo ownership_relation record
     ↓
[System] Tạo remix record với parent_song_id
     ↓
[System] Index remix vào search engine
     ↓
[System] Notify Original Creator: "Your track got remixed!"
     ↓
[Remixer] Redirect về remix detail page
```

---

## AI Remix Operations

| Operation | Tech | Mô tả |
|-----------|------|-------|
| Style Transfer | MusicGen + PyTorch | Đổi genre/mood |
| Tempo Shift | Librosa | BPM adjustment |
| Pitch Shift | Librosa | Key/semitone change |
| Vocal Transformation | Spleeter + processing | Giữ/đổi/xóa vocals |
| FX Layering | Pedalboard | Reverb, distortion, bass boost |

---

## AI Processing Time (estimates)

| Action | Time |
|--------|------|
| Basic tempo/pitch shift | 10–30 seconds |
| Style transfer | 30–120 seconds |
| Full AI remix | 1–5 minutes |
| Queue wait (peak) | +2–10 minutes |

---

## Error Cases

| Error | Handling |
|-------|---------|
| Song không cho remix | Block với thông báo rõ ràng |
| AI service timeout | Show error, cho phép retry |
| GPU queue full | Show estimated wait time |
| Invalid prompt | Show prompt guidelines |
| Storage fail | Retry với exponential backoff |

---

## Acceptance Criteria

- [ ] Chỉ hiện nút "Remix" cho bài có `remix_allowed = true`
- [ ] AI remix queue xử lý async, không block UI
- [ ] Progress indicator hiển thị trong quá trình AI processing
- [ ] Preview audio trước khi publish
- [ ] Ownership split hiển thị rõ trước khi confirm
- [ ] Ownership record được tạo đúng với parent relationship
- [ ] Original creator nhận notification khi bài bị remix

---

## Related

- [[SRS-AI-Remix-Engine]]
- [[SRS-Ownership-Graph]]
- [[API-AI]]
- [[API-Ownership]]
- [[Table-Remixes]]
- [[Table-Ownership-Relations]]
- [[ADR-003-FastAPI-AI-Service]]
