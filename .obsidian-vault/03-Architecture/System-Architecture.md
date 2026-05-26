---
title: System Architecture — StemVerse
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - system-design
  - microservices
---

# System Architecture — StemVerse

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Web App (Next.js)  │    │  Mobile App (Phase 3)    │  │
│  └──────────┬───────────┘    └──────────────────────────┘  │
└─────────────┼───────────────────────────────────────────────┘
              │ HTTPS / WebSocket
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      GATEWAY LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           API Gateway (NestJS Gateway Service)         │  │
│  │   Rate Limiting │ Auth Middleware │ Load Balancing     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Internal HTTP / Message Queue
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (Microservices)              │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │  Music   │ │  AI Svc  │ │   Royalty    │  │
│  │ Service  │ │ Service  │ │(FastAPI) │ │   Service    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Payment  │ │  Search  │ │  Notif   │ │   Admin      │  │
│  │ Service  │ │ Service  │ │ Service  │ │   Service    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              ▼               ▼
┌─────────────────┐   ┌──────────────────────────────────────┐
│   DATA LAYER    │   │           STORAGE LAYER               │
│                 │   │                                        │
│  ┌───────────┐  │   │  ┌────────────────────────────────┐  │
│  │PostgreSQL │  │   │  │    Cloudflare R2 (Object Store) │  │
│  └───────────┘  │   │  │    - Audio files (mp3, wav)     │  │
│  ┌───────────┐  │   │  │    - Stems                      │  │
│  │  Redis    │  │   │  │    - Waveforms                  │  │
│  │(Cache +   │  │   │  └────────────────────────────────┘  │
│  │ Queue)    │  │   └──────────────────────────────────────┘
│  └───────────┘  │
│  ┌───────────┐  │
│  │Meilisearch│  │
│  └───────────┘  │
└─────────────────┘
```

## Microservices Breakdown

| Service | Tech | Port | Responsibility |
|---------|------|------|---------------|
| `gateway-service` | NestJS | 3000 | Routing, auth middleware, rate limiting |
| `auth-service` | NestJS | 3001 | Login, JWT, OAuth |
| `music-service` | NestJS | 3002 | Upload, songs, stems, waveforms |
| `ai-service` | FastAPI | 8000 | AI analysis, remix engine, stem separation |
| `royalty-service` | NestJS | 3003 | Ownership graph, royalty calculation |
| `payment-service` | NestJS | 3004 | Stripe, MoMo, VNPay |
| `notification-service` | NestJS | 3005 | Email, WebSocket, push |
| `search-service` | NestJS | 3006 | Meilisearch integration |
| `admin-service` | NestJS | 3007 | Admin panel API |

## Communication Patterns

### Synchronous (REST/gRPC)
- Client → Gateway → Service
- Service → Service (direct calls, low latency required)

### Asynchronous (Message Queue via Redis/BullMQ)
- Audio processing jobs
- Royalty calculation events
- Notification dispatch
- Email queue

## Data Flow: Upload + AI Processing

```
1. Client uploads to R2 (presigned URL)
2. Client calls music-service: "upload complete"
3. music-service creates song record
4. music-service publishes: audio.uploaded event (Redis)
5. ai-service consumes event → processes stems
6. ai-service publishes: audio.processed event
7. music-service updates song: processing_status = done
8. notification-service sends: "Your track is ready!"
```

## Technology Stack Summary

### Frontend
```
Framework:    Next.js 15 (App Router)
Language:     TypeScript
Styling:      Tailwind CSS
Animation:    Framer Motion
State:        Zustand
Data Fetch:   TanStack Query
Audio:        Wavesurfer.js
```

### Backend (NestJS Services)
```
Framework:    NestJS
Language:     TypeScript
ORM:          Prisma
Auth:         Passport.js (JWT + OAuth)
Validation:   class-validator + Zod
Queue:        BullMQ
```

### AI Service (FastAPI)
```
Framework:    FastAPI
Language:     Python 3.11
AI:           PyTorch, MusicGen
Audio:        Demucs, Librosa, FFmpeg, Pedalboard
Queue:        Celery + Redis (or BullMQ via HTTP)
```

### Infrastructure
```
Database:     PostgreSQL 16
Cache/Queue:  Redis 7
Search:       Meilisearch
Storage:      Cloudflare R2
CDN:          Cloudflare
Email:        Resend / SendGrid
WebSocket:    Socket.IO
```

## Security Architecture

```
┌────────────────────────────────────┐
│            Security Layers          │
├────────────────────────────────────┤
│ 1. TLS/HTTPS (Cloudflare)          │
│ 2. JWT Authentication              │
│ 3. Rate Limiting (gateway)         │
│ 4. Signed URLs (R2 storage)        │
│ 5. DRM-style streaming (HLS)       │
│ 6. Anti-piracy watermark           │
│ 7. RBAC (role-based access)        │
└────────────────────────────────────┘
```

## Deployment Architecture

```
Production:
├── Vercel (Next.js frontend)
├── Railway / Fly.io (NestJS services)
├── Modal / RunPod (FastAPI + GPU)
└── Cloudflare R2 (storage)

Development:
└── Docker Compose (all services local)
```

## Related

- [[Frontend-Architecture]]
- [[Backend-Architecture]]
- [[Microservice-Map]]
- [[Database-Design]]
- [[AI-Pipeline]]
- [[ADR-001-NextJS-Frontend]]
- [[ADR-002-NestJS-Backend]]
