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
| **Phase** | 🟢 Sprint 2 — Done (Entering Sprint 3) |
| **MVP Phase 1** | 🔵 In Progress |
| **MVP Phase 2** | ⬜ Pending |
| **MVP Phase 3** | ⬜ Pending |
| **Solo Developer** | ✅ Active |

---

## 📌 Quick Links

### 📋 Business
- [[StemVerse-Overview]] — Tổng quan sản phẩm
- [[User-Roles]] — 4 actor chính (Creator, Remixer, Consumer, Admin)
- [[Business-Rules]] — Quy tắc kinh doanh & ownership
- **User Flows:** [[Flow-Upload-Music]] | [[Flow-AI-Remix]] | [[Flow-Buy-License]] | [[Flow-Royalty-Split]]

### 📐 SRS (Software Requirement Specification)
- [[SRS-Authentication]] | [[SRS-Music-Upload]] | [[SRS-AI-Analysis]]
- [[SRS-AI-Remix-Engine]] | [[SRS-Ownership-Graph]] | [[SRS-Licensing]]
- [[SRS-Royalty-Engine]] | [[SRS-Marketplace]] | [[SRS-AI-Voice]]
- [[SRS-Realtime-Collab]] | [[SRS-Social]] | [[SRS-Admin]]

### 🏗 Architecture
- [[System-Architecture]] — Kiến trúc tổng thể
- [[Frontend-Architecture]] — Next.js 15 App Router
- [[Backend-Architecture]] — NestJS Microservices
- [[Database-Design]] — PostgreSQL + Prisma
- [[AI-Pipeline]] — Demucs, Librosa, MusicGen

### 🗂 ADR (Architecture Decision Records)
- [[ADR-001-NextJS-Frontend]] | [[ADR-002-NestJS-Backend]] | [[ADR-003-FastAPI-AI-Service]]
- [[ADR-004-PostgreSQL-Database]] | [[ADR-005-Redis-Cache-Queue]] | [[ADR-006-Cloudflare-R2-Storage]]
- [[ADR-007-Demucs-Stem-Separation]] | [[ADR-008-Stripe-Payment]]

### 🔌 API Docs
- [[API-Auth]] | [[API-Music]] | [[API-AI]]
- [[API-Ownership]] | [[API-Licensing]] | [[API-Royalty]]
- [[API-Marketplace]] | [[API-Admin]]

### 🗄 Database Tables
- [[ERD]] | [[Table-Users]] | [[Table-Songs]] | [[Table-Stems]]
- [[Table-Ownership-Relations]] | [[Table-Licenses]] | [[Table-Royalty-Transactions]]

### 🤖 Superpowers Workflow
- [[07-Superpowers/Plans/index|Plans]] | [[07-Superpowers/TDD/index|TDD]] | [[07-Superpowers/Code-Review/index|Code Review]]

### 🧪 Testing
- [[Test-Strategy]] | [[Testcase-Upload]] | [[Testcase-AI-Remix]] | [[Testcase-Royalty]]

### 🗺 MVP Roadmap
- [[MVP-Phase1]] — Core Features
- [[MVP-Phase2]] — Realtime Collab, AI Voice, Marketplace
- [[MVP-Phase3]] — Mobile, Blockchain

---

## 🗓 Kanban — Sprint 1

### ✅ DONE
- [x] Business docs hoàn chỉnh (SRS, ADRs, User Flows)
- [x] Obsidian Vault structure
- [x] Database schema + Prisma migrations + seeding
- [x] Theme switching (Light/Dark) + i18n (EN/VI)
- [x] Authentication Service (NestJS + JWT + TDD — 21 tests PASS)
- [x] Frontend Auth pages (Login, Register, Profile)

### 🔄 IN PROGRESS
*(Chưa có)*

### 📥 TODO
- [x] Setup Cloudflare R2 Storage (Sprint 2)
- [x] Music Upload API (Sprint 2)
- [x] FastAPI AI Service Boilerplate (Sprint 2)
- [x] Waveform Generation (Sprint 2)
- [x] BPM & Key detection (Sprint 2)
- [x] Stripe Payment Integration & Licensing System (Sprint 2/3)

---

## 📏 Iron Laws

> 1. **KHÔNG CÓ SPEC → KHÔNG CÓ CODE**
> 2. **KHÔNG CÓ TEST LỖI → KHÔNG CÓ CODE PRODUCTION**
> 3. **BẰNG CHỨNG TRƯỚC — BÁO CÁO SAU**

---

## 🔗 Workflow

```
1. Viết requirement → .obsidian-vault/01-Business/
2. Tách thành SRS   → .obsidian-vault/02-SRS/
3. Tạo ADR          → .obsidian-vault/04-ADR/
4. Tạo plan         → .obsidian-vault/07-Superpowers/Plans/
5. Đưa plan cho AI  → .superpowers/ rules
6. Code theo TDD    → Red → Green → Refactor
7. Lưu knowledge    → API, DB, testcase, lesson learned
```
