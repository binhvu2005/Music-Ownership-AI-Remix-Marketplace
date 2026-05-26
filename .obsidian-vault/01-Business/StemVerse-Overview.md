---
title: StemVerse — Tổng quan sản phẩm
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - business
  - overview
  - stemverse
---

# StemVerse — Tổng quan sản phẩm

## Tên sản phẩm

**StemVerse**

## Product Type

AI-powered Music Ownership & Remix Marketplace

## Tagline

> "GitHub + Spotify + AI Remix Engine cho âm nhạc"

---

## Mô tả ngắn

StemVerse là nền tảng cho phép:

- **Upload** bài nhạc gốc (full track + stems)
- **Remix bằng AI** — style transfer, tempo/pitch shift, FX layering
- **Mua/bán license** âm nhạc theo loại (Personal / Commercial / Remix / Exclusive)
- **Quản lý derivative ownership** — GitHub-style ownership graph
- **Chia royalty tự động** theo tỷ lệ đã định sẵn

---

## Business Problem

Internet hiện tại có **remix culture** bùng nổ:

| Hiện tượng | Ví dụ |
|-----------|-------|
| AI cover | TikTok AI voice covers |
| Remix văn hóa | Phonk remix, sped-up songs |
| TikTok edits | Video edit dùng nhạc |
| Mashups | Ghép nhiều bài |

**Nhưng thiếu:**

| Vấn đề | Hậu quả |
|--------|--------|
| Ownership không rõ ràng | Creator bị reupload |
| Không track derivative works | Mất kiểm soát |
| Không chia revenue đúng | Creator thiệt hại |
| AI remix thiếu legal framework | Tranh chấp pháp lý |

---

## Product Vision

> Xây dựng **programmable ownership infrastructure for music**

Mỗi bài nhạc trên StemVerse:
- Có **ownership graph** rõ ràng
- Mỗi remix được **track tự động**
- Mỗi usage được **license hóa**
- Royalty được **chia tự động**

---

## Core Concept: Music = Modular Asset

Một bài nhạc không chỉ là `.mp3`. Mà gồm:

```
Song Asset
├── vocals.wav
├── drums.wav
├── bass.wav
├── synth.wav
├── guitar.wav
├── piano.wav
├── melody.wav
├── metadata (BPM, key, genre, mood)
└── ownership_rules (license type, split %)
```

---

## Unique Selling Points (USP)

| USP | Mô tả |
|-----|-------|
| 🏆 **Primary USP** | GitHub-style ownership graph cho music derivatives |
| 🥈 **Secondary USP** | AI remixing với automated royalty distribution |
| 🥉 **Tertiary USP** | Modular stem marketplace |

---

## Monetization

| Stream | Chi tiết |
|--------|---------|
| Transaction Fee | 5–15% mỗi giao dịch |
| Premium Subscription | Advanced AI tools |
| Commercial Licensing | Brands / game studios |
| AI Processing Credits | GPU-intensive remix generation |

---

## MVP Phases

| Phase | Features |
|-------|---------|
| **Phase 1** | Upload music, waveform, stem separation, AI remix, ownership graph, royalty split |
| **Phase 2** | Realtime collaboration, AI voice, marketplace |
| **Phase 3** | Mobile app, investor royalties, blockchain proof, advanced AI |

---

## Long-Term Vision

> Biến music thành **programmable collaborative ownership assets**

Nơi **AI + remix culture + creator economy + licensing + revenue sharing** được kết nối thành một ecosystem thống nhất.

---

## Related

- [[User-Roles]]
- [[Business-Rules]]
- [[System-Architecture]]
- [[SRS-Ownership-Graph]]
- [[SRS-Royalty-Engine]]
- [[MVP-Phase1]]
