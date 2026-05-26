---
title: StemVerse — Project Dashboard
author: Solo Developer
created: 2026-05-26
updated: 2026-05-26
status: Active
tags:
  - dashboard
  - overview
  - stemverse
---

# 🎵 StemVerse — Project Dashboard

> **"GitHub + Spotify + AI Remix Engine cho âm nhạc"**
> AI-powered Music Ownership & Remix Marketplace

---

## 🚦 Project Status

| Item | Status |
|------|--------|
| **Phase** | 🟡 Planning & Documentation |
| **MVP Phase 1** | 🔴 Not Started |
| **MVP Phase 2** | ⬜ Pending |
| **MVP Phase 3** | ⬜ Pending |
| **Solo Developer** | ✅ Active |

---

## 📌 Quick Links

### 📋 Business
- [[StemVerse-Overview]] — Tổng quan sản phẩm
- [[User-Roles]] — 4 actor chính
- [[Business-Rules]] — Quy tắc kinh doanh & ownership
- [[Flow-Upload-Music]] | [[Flow-AI-Remix]] | [[Flow-Buy-License]] | [[Flow-Royalty-Split]]

### 📐 SRS (Software Requirement Specification)
- [[SRS-Authentication]] | [[SRS-Music-Upload]] | [[SRS-AI-Analysis]]
- [[SRS-AI-Remix-Engine]] | [[SRS-Ownership-Graph]] | [[SRS-Licensing]]
- [[SRS-Royalty-Engine]] | [[SRS-Marketplace]] | [[SRS-AI-Voice]]
- [[SRS-Realtime-Collab]] | [[SRS-Social]] | [[SRS-Admin]]

### 🏗 Architecture
- [[System-Architecture]] — Kiến trúc tổng thể
- [[Microservice-Map]] — Bản đồ microservices
- [[Database-Design]] — Thiết kế database
- [[AI-Pipeline]] — Pipeline xử lý AI

### 🗂 ADR (Architecture Decision Records)
- [[ADR-001-NextJS-Frontend]] | [[ADR-002-NestJS-Backend]] | [[ADR-003-FastAPI-AI-Service]]
- [[ADR-004-PostgreSQL-Database]] | [[ADR-005-Redis-Cache-Queue]]
- [[ADR-006-Cloudflare-R2-Storage]] | [[ADR-007-Demucs-Stem-Separation]] | [[ADR-008-Stripe-Payment]]

### 🗄 Database Tables
- [[ERD]] | [[Table-Users]] | [[Table-Songs]] | [[Table-Stems]]
- [[Table-Remixes]] | [[Table-Ownership-Relations]] | [[Table-Licenses]] | [[Table-Royalty-Transactions]]

### 🔌 API Docs
- [[API-Auth]] | [[API-Music]] | [[API-AI]] | [[API-Ownership]]
- [[API-Licensing]] | [[API-Royalty]] | [[API-Marketplace]] | [[API-Admin]]

### 🧪 Testing
- [[Test-Strategy]] | [[Testcase-Upload]] | [[Testcase-AI-Remix]] | [[Testcase-Royalty]]

### 🗺 MVP Roadmap
- [[MVP-Phase1]] — Core Features (Upload, Waveform, Stem, AI Remix, Ownership, Royalty)
- [[MVP-Phase2]] — Realtime Collab, AI Voice, Marketplace
- [[MVP-Phase3]] — Mobile, Investor Royalties, Blockchain

### 🤖 AI & Superpowers
- [[Prompt-Generate-Spec]] | [[Prompt-Generate-Plan]] | [[Prompt-Code-Review]]

---

## 🗓 Kanban — MVP Phase 1

### 📥 TODO
- [ ] Setup Next.js + NestJS + FastAPI boilerplate
- [ ] Setup PostgreSQL + Redis + Cloudflare R2
- [ ] Implement Auth (Email/Password + Google OAuth)
- [ ] Music Upload System
- [ ] Stem Separation với Demucs
- [ ] Waveform Generation
- [ ] Basic Ownership Graph
- [ ] Royalty Split Engine (MVP)
- [ ] AI Remix (basic prompting)

### 🔄 IN PROGRESS
*(Chưa có)*

### ✅ DONE
- [x] SRS Document hoàn chỉnh
- [x] Obsidian Vault structure
- [x] Superpowers config
- [x] ADR decisions

---

## 🛠 Tech Stack

### Frontend
| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand |

### Backend
| Layer | Tech |
|-------|------|
| Main API | NestJS |
| AI Service | FastAPI (Python) |
| Database | PostgreSQL |
| Cache/Queue | Redis + BullMQ |
| Storage | Cloudflare R2 |

### AI/Audio
| Layer | Tech |
|-------|------|
| Stem Separation | Demucs / Spleeter |
| Audio Analysis | Librosa |
| Processing | FFmpeg |
| AI Remix | MusicGen / PyTorch |

### Payment
| Method | Provider |
|--------|---------|
| International | Stripe |
| Vietnam | MoMo, VNPay |

---

## 🎯 Unique Selling Points

1. **GitHub-style Ownership Graph** — Track toàn bộ derivative works
2. **AI Remix + Auto Royalty** — Remix bằng AI, chia tiền tự động
3. **Modular Music Asset** — Mỗi bài nhạc = stems + metadata + ownership rules

---

## 📏 Solo Dev Rules (Iron Laws)

> Xem chi tiết tại `docs/convention.md` hoặc `.agent/rules/coding-rules.md`

1. **KHÔNG CÓ SPEC → KHÔNG CÓ CODE**
2. **KHÔNG CÓ TEST LỖI → KHÔNG CÓ CODE PRODUCTION**
3. **BẰNG CHỨNG TRƯỚC — BÁO CÁO SAU**

---

## 🔗 References

- [Đặc tả SRS](../srs.md)
- [Quy tắc viết code](../convention.md)
- [Bảng công việc backlogs](../backlogs/sprint1/tasks.md)
- [Tiêu chuẩn thiết kế database](../DB-erd/erd.md)
- [Quy trình AI agent](../../.agent/rules/project-context.md)
