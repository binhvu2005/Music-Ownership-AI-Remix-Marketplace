---
title: Project Context — StemVerse
author: Solo Developer
created: 2026-05-26
version: 1.0.0
---

# StemVerse — Project Context (AI Agent Read This First)

## What Is This Project?

**StemVerse** = AI-powered Music Ownership & Remix Marketplace

Tagline: *"GitHub + Spotify + AI Remix Engine cho âm nhạc"*

This is a **solo developer project**. You are the AI coding agent assisting the solo developer.

---

## Core Problem You're Solving

Musicians and remixers lack:
1. Clear ownership tracking for derivative works (remixes)
2. Automatic royalty distribution
3. Legal framework for AI-generated remixes

StemVerse solves this with a **GitHub-style ownership graph** for music.

---

## Technology Stack (NON-NEGOTIABLE)

Read these before suggesting alternatives:

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js 15 (App Router) + TypeScript | See [[ADR-001-NextJS-Frontend]] |
| Styling | Tailwind CSS | Already decided |
| State | Zustand | Already decided |
| Backend | NestJS + TypeScript | See [[ADR-002-NestJS-Backend]] |
| AI Service | FastAPI + Python | See [[ADR-003-FastAPI-AI-Service]] |
| ORM | Prisma | Already decided |
| Database | PostgreSQL 16 | See [[ADR-004-PostgreSQL-Database]] |
| Cache/Queue | Redis + BullMQ | See [[ADR-005-Redis-Cache-Queue]] |
| Storage | Cloudflare R2 | See [[ADR-006-Cloudflare-R2-Storage]] |
| Stem Separation | Demucs (HTDemucs) | See [[ADR-007-Demucs-Stem-Separation]] |
| Payment | Stripe + MoMo + VNPay | See [[ADR-008-Stripe-Payment]] |
| Search | Meilisearch | Already decided |

**DO NOT** suggest switching tech without reading the ADRs.

---

## Microservices

```
gateway-service  :3000
auth-service     :3001
music-service    :3002
ai-service       :8000 (Python/FastAPI)
royalty-service  :3003
payment-service  :3004
notification-svc :3005
search-service   :3006
admin-service    :3007
```

---

## Key Business Rules (READ BEFORE CODING)

1. **Ownership Graph is immutable** — `ownership_relations` records NEVER update after creation
2. **Platform fee = 10%** of every revenue event
3. **Default remix split** = Original Creator 70% / Remixer 20% / Platform 10%
4. **Remix requires** `song.remix_allowed = true`
5. **AI Voice Cloning of celebrities = PROHIBITED** — absolute hard rule
6. **Exclusive license** = only 1 buyer allowed (auto-disable after sold)

---

## Current MVP Phase

**Phase 1** (currently building):
- [ ] Auth (Email + Google OAuth)
- [ ] Music Upload (full track + stems)
- [ ] AI Analysis (BPM, Key, Waveform, Stem Separation)
- [ ] Ownership Graph
- [ ] Basic AI Remix
- [ ] Royalty Split Engine
- [ ] Licensing System

**Phase 2** (next):
- Realtime Collaboration
- AI Voice System
- Marketplace

**Phase 3** (future):
- Mobile App
- Blockchain proof
- Investor royalties

---

## Coding Standards (MANDATORY)

Read `.superpowers/coding-rules.md` before writing any code.

Summary:
1. **NO CODE without Spec** → Spec lives in `.obsidian-vault/02-SRS/`
2. **NO CODE without failing test** → TDD: Red → Green → Refactor
3. **NO "should work" reporting** → Show test output as proof

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| NestJS service | `{feature}.service.ts` | `songs.service.ts` |
| NestJS controller | `{feature}.controller.ts` | `songs.controller.ts` |
| NestJS module | `{feature}.module.ts` | `songs.module.ts` |
| DTO | `{action}-{feature}.dto.ts` | `create-song.dto.ts` |
| Test | `{feature}.spec.ts` | `songs.service.spec.ts` |
| React component | `PascalCase.tsx` | `TrackCard.tsx` |
| Hook | `use{Feature}.ts` | `useAudio.ts` |
| Prisma migration | `YYYYMMDDHHMMSS_description` | |

---

## Key Documents

- Full SRS: `.obsidian-vault/02-SRS/`
- Architecture: `.obsidian-vault/03-Architecture/`
- ADRs: `.obsidian-vault/04-ADR/`
- Database design: `.obsidian-vault/06-Database/`
- API contracts: `.obsidian-vault/05-API/`
- Test cases: `.obsidian-vault/08-Testing/`
- MVP roadmap: `.obsidian-vault/09-MVP-Roadmap/`

---

## Questions to Ask Before Coding

Before implementing any feature, ask yourself:
1. Is there a Spec for this? (`.obsidian-vault/02-SRS/`)
2. Does it align with the Architecture? (`.obsidian-vault/03-Architecture/`)
3. Have I read the relevant ADRs?
4. Do I have failing tests written first?
5. Does this affect the ownership graph? (critical path)
