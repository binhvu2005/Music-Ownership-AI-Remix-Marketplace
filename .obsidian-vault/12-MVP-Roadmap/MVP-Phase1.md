---
title: MVP Phase 1 — Core Features
author: Solo Developer
created: 2026-05-26
status: In Progress
tags: [mvp, phase1, roadmap]
---

# MVP Phase 1 — Core Features

## Goal

Launch một platform có thể:
- Creator upload nhạc + tự động AI analyze
- Remixer remix bằng AI với text prompt
- Hệ thống ownership graph track derivatives
- Royalty split tự động

**Target**: Functional MVP cho demo + early users

---

## Feature List

| Feature               | Status  | SRS                     | ADR                                | Priority |
| --------------------- | ------- | ----------------------- | ---------------------------------- | -------- |
| Auth System           | 🟢 DONE | [[SRS-Authentication]]  | [[ADR-002-NestJS-Backend]]         | P0       |
| Music Upload          | 🟢 DONE | [[SRS-Music-Upload]]    | [[ADR-006-Cloudflare-R2-Storage]]  | P0       |
| AI Audio Analysis     | 🔴 TODO | [[SRS-AI-Analysis]]     | [[ADR-007-Demucs-Stem-Separation]] | P0       |
| Ownership Graph       | 🔴 TODO | [[SRS-Ownership-Graph]] | [[ADR-004-PostgreSQL-Database]]    | P0       |
| Basic AI Remix        | 🔴 TODO | [[SRS-AI-Remix-Engine]] | [[ADR-003-FastAPI-AI-Service]]     | P1       |
| Royalty Split Engine  | 🔴 TODO | [[SRS-Royalty-Engine]]  | [[ADR-008-Stripe-Payment]]         | P1       |
| Licensing System      | 🔴 TODO | [[SRS-Licensing]]       |                                    | P1       |
| Basic Marketplace     | 🔴 TODO | [[SRS-Marketplace]]     |                                    | P2       |
| Social (Like, Follow) | 🔴 TODO | [[SRS-Social]]          |                                    | P2       |

---

## Sprint Plan (1 Person)

### Sprint 1: Foundation (2 weeks)
- [x] Setup monorepo structure
- [x] Setup Docker Compose (PostgreSQL + Redis + Meilisearch)
- [x] Setup Prisma schema (core tables)
- [x] Auth Service: Email/Password + JWT
- [x] Auth Service: Google OAuth
- [x] Basic Next.js frontend: Layout, Auth pages

### Sprint 2: Music Upload (2 weeks)
- [x] Cloudflare R2 setup
- [x] Music Service: Presigned upload URLs
- [x] Music Service: Song CRUD
- [x] AI Service: FastAPI setup
- [x] AI Service: Waveform generation (FFmpeg)
- [x] AI Service: BPM + Key detection (Librosa)
- [x] Frontend: Upload page + progress

### Sprint 3: AI Analysis + Ownership (2 weeks)
- [x] AI Service: Stem separation (Demucs)
- [x] BullMQ queue setup
- [ ] Royalty Service: Ownership graph
- [ ] Royalty Service: Basic royalty calculation
- [x] Frontend: Waveform player + stems display
- [ ] Frontend: Ownership graph visualization (D3.js)

### Sprint 4: Licensing + Payments (2 weeks)
- [ ] Payment Service: Stripe integration
- [ ] Licensing system: Create + validate licenses
- [ ] Royalty payout: Stripe Connect
- [ ] Frontend: License purchase flow
- [ ] Frontend: Wallet + royalty dashboard

### Sprint 5: AI Remix + Polish (2 weeks)
- [ ] AI Service: Basic AI remix (MusicGen)
- [ ] Remix Studio UI
- [ ] Ownership auto-creation on remix publish
- [ ] Social: Like + Comment
- [ ] Search: Meilisearch integration
- [ ] Admin: Basic dashboard
- [ ] Bug fixing + polish

---

## Done Criteria for Phase 1

- [ ] Creator có thể upload full track → AI tự analyze
- [ ] Stems được tách trong 5 phút
- [ ] Remixer có thể tạo AI remix với text prompt
- [ ] Ownership record tạo tự động
- [ ] Royalty split đúng formula
- [ ] Consumer mua license → payment works
- [ ] 0 critical bugs
- [ ] Test coverage ≥ 80%

---

## Related

- [[MVP-Phase2]]
- [[MVP-Phase3]]
- [[StemVerse-Overview]]
- [[Project-Dashboard]]
