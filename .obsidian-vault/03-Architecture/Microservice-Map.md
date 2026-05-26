---
title: Microservice Map
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - microservices
  - map
---

# Microservice Map — StemVerse

## Services Overview

| Service | Language | Port | Dependencies |
|---------|---------|------|-------------|
| `gateway-service` | TypeScript/NestJS | 3000 | All services |
| `auth-service` | TypeScript/NestJS | 3001 | PostgreSQL, Redis |
| `music-service` | TypeScript/NestJS | 3002 | PostgreSQL, R2, Redis/BullMQ |
| `ai-service` | Python/FastAPI | 8000 | R2, Redis, GPU |
| `royalty-service` | TypeScript/NestJS | 3003 | PostgreSQL, Redis |
| `payment-service` | TypeScript/NestJS | 3004 | PostgreSQL, Stripe/MoMo/VNPay |
| `notification-service` | TypeScript/NestJS | 3005 | Redis, Email |
| `search-service` | TypeScript/NestJS | 3006 | Meilisearch, PostgreSQL |
| `admin-service` | TypeScript/NestJS | 3007 | PostgreSQL |

## Communication Map

```
Client (Browser)
    │
    └─── HTTPS ──► gateway-service :3000
                        │
              ┌─────────┼──────────┐──────────┐
              ▼         ▼          ▼          ▼
         auth-svc  music-svc  royalty-svc  search-svc
          :3001      :3002       :3003       :3006
              │         │          │
              │         │ BullMQ   │ Redis Events
              │         ▼          ▼
              │      ai-svc     payment-svc
              │       :8000       :3004
              │         │
              └─────────┴──► notification-svc :3005
                                    │
                                    ├── Email (Resend)
                                    └── WebSocket (Socket.IO)
```

## Shared Infrastructure

```
PostgreSQL :5432
  ├── db_auth        (auth-service)
  ├── db_music       (music-service)
  ├── db_royalty     (royalty-service)
  ├── db_payment     (payment-service)
  └── db_admin       (admin-service)

Redis :6379
  ├── Cache          (auth tokens, session)
  ├── BullMQ Queues  (audio-analysis, ai-remix, notifications)
  └── Pub/Sub        (royalty events)

Meilisearch :7700
  └── Index: songs

Cloudflare R2
  ├── bucket: stemverse-audio    (original files)
  ├── bucket: stemverse-stems    (separated stems)
  └── bucket: stemverse-preview  (preview clips)
```

## Docker Compose (Development)

```yaml
services:
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  meilisearch:
    image: getmeili/meilisearch:latest
    ports: ["7700:7700"]
  
  gateway:
    build: ./gateway-service
    ports: ["3000:3000"]
    depends_on: [postgres, redis]
  
  auth:
    build: ./auth-service
    ports: ["3001:3001"]
  
  music:
    build: ./music-service
    ports: ["3002:3002"]
  
  ai:
    build: ./ai-service
    ports: ["8000:8000"]
    # GPU: deploy via Modal/RunPod in production
  
  royalty:
    build: ./royalty-service
    ports: ["3003:3003"]
  
  payment:
    build: ./payment-service
    ports: ["3004:3004"]
  
  notification:
    build: ./notification-service
    ports: ["3005:3005"]
  
  search:
    build: ./search-service
    ports: ["3006:3006"]
  
  admin:
    build: ./admin-service
    ports: ["3007:3007"]
```

## Service Responsibilities (RACI)

| Task | Service |
|------|---------|
| JWT generation/validation | auth-service |
| File upload (presigned URL) | music-service |
| Stem separation | ai-service |
| BPM/Key detection | ai-service |
| Ownership record creation | royalty-service |
| Royalty calculation | royalty-service |
| Payment processing | payment-service |
| Payout trigger | payment-service |
| Search indexing | search-service |
| Email sending | notification-service |
| WebSocket events | notification-service |
| Admin actions | admin-service |

## Related

- [[System-Architecture]]
- [[Backend-Architecture]]
- [[ADR-002-NestJS-Backend]]
- [[ADR-005-Redis-Cache-Queue]]
