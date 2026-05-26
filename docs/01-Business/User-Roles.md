---
title: StemVerse — User Roles
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - business
  - actors
  - roles
---

# StemVerse — User Roles (Actors)

## Tổng quan

StemVerse có **4 actor chính** tương tác với hệ thống:

```
StemVerse Platform
├── A. Original Creator  — Upload nhạc gốc
├── B. Remixer           — Remix bằng AI / manual
├── C. Consumer          — Nghe, mua license
└── D. Investor/Fan      — Mua royalty share, đầu tư creator
```

---

## A. Original Creator

### Mô tả
Người upload nhạc gốc lên StemVerse. Có thể là producer, singer, composer, hoặc label.

### Quyền hạn

| Hành động | Chi tiết |
|-----------|---------|
| Upload full track | `.mp3`, `.wav` |
| Upload stems | `vocals.wav`, `drums.wav`, `bass.wav`, ... |
| Cấu hình metadata | BPM, key, genre, mood, tags |
| Thiết lập license | Personal / Commercial / Remix / Exclusive |
| Cấu hình royalty split | % chia cho remixer |
| Toggle remix permission | Cho phép / Cấm remix |
| Xem ownership graph | Dashboard derivative tree |
| Nhận royalty | Tự động theo payment event |
| DMCA takedown | Báo cáo vi phạm |

### Dashboard Features
- Streams analytics
- Remix count
- Earnings breakdown
- Trending assets
- Royalty flow chart

---

## B. Remixer

### Mô tả
Người remix bài hát bằng AI engine, stem editor, hoặc manual edits.

### Quyền hạn

| Hành động | Chi tiết |
|-----------|---------|
| Chọn bài nhạc gốc | Bài có `remix_allowed = true` |
| Nhập remix prompt | `"Convert to dark phonk"` |
| Sử dụng AI Remix Engine | Style transfer, tempo/pitch shift |
| Edit stems thủ công | Kéo/thả trong waveform editor |
| Publish remix | Sau khi ownership split được tạo |
| Nhận royalty từ remix | Theo split % đã định |
| Realtime collaboration | Remix cùng người khác |

### Remix Prompt Examples
```
"Convert this song into dark phonk"
"Make it anime opening style"
"Synthwave remix with heavy bass"
"Lofi chill version"
```

---

## C. Consumer

### Mô tả
Người nghe, mua license để sử dụng trong commercial projects.

### Quyền hạn

| Hành động | Chi tiết |
|-----------|---------|
| Stream nhạc | Preview full track |
| Mua Personal License | Dùng cá nhân |
| Mua Commercial License | Dùng kiếm tiền, YouTube, ads |
| Mua Remix License | Quyền remix bài nhạc |
| Mua Exclusive License | Chỉ một người sở hữu usage rights |
| Download stems | Sau khi mua license phù hợp |
| Theo dõi creator | Follow system |
| Like / Comment | Social features |

### License Price Tiers
```
Personal License:    Free — $9.99
Commercial License:  $19.99 — $99.99
Remix License:       $9.99 — $49.99
Exclusive License:   $500+ (negotiated)
```

---

## D. Investor / Fan

### Mô tả
Người đầu tư vào creator hoặc mua royalty share để nhận passive income.

### Quyền hạn (Phase 3)

| Hành động | Chi tiết |
|-----------|---------|
| Mua royalty share | % share của một bài nhạc |
| Nhận royalty passive | Theo lượng streams / sales |
| Xem royalty dashboard | Tracking investment |
| Support creator | Fan funding |

> [!NOTE]
> Investor/Fan features thuộc **MVP Phase 3**. Phase 1 và 2 tập trung vào Creator, Remixer, Consumer.

---

## Quyền hạn theo MVP Phase

| Feature | Creator | Remixer | Consumer | Investor |
|---------|---------|---------|---------|---------|
| Upload | ✅ Phase 1 | — | — | — |
| Stem separation | ✅ Phase 1 | — | — | — |
| AI Remix | — | ✅ Phase 1 | — | — |
| Buy License | — | — | ✅ Phase 1 | — |
| Royalty receive | ✅ Phase 1 | ✅ Phase 1 | — | — |
| Realtime collab | ✅ Phase 2 | ✅ Phase 2 | — | — |
| Royalty share invest | — | — | — | ✅ Phase 3 |

---

## Related

- [[StemVerse-Overview]]
- [[Business-Rules]]
- [[Flow-Upload-Music]]
- [[Flow-AI-Remix]]
- [[Flow-Buy-License]]
- [[Flow-Royalty-Split]]
- [[SRS-Authentication]]
