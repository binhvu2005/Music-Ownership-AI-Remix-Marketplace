---
title: ADR-003 — Use FastAPI for AI Service
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, ai, fastapi, python]
---

# ADR-003 — Use FastAPI for AI Service

## Status: Accepted ✅

## Context

AI processing (Demucs, Librosa, MusicGen) yêu cầu Python ecosystem. Cần chọn Python framework.

## Decision

Dùng **FastAPI** cho AI service.

## Reasons

| Reason | Detail |
|--------|-------|
| Python ecosystem | Demucs, Librosa, PyTorch đều Python |
| Async support | asyncio compatible |
| Auto OpenAPI docs | /docs endpoint tự động |
| Pydantic validation | Type safety cho API |
| Performance | ASGI, nhanh hơn Flask |

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| Flask | Sync-only, slower |
| Django | Quá nặng cho AI service |
| Express + Python subprocess | Anti-pattern |

## GPU Strategy

- Development: CPU (Demucs fallback to CPU)
- Production: Modal.com (serverless GPU) hoặc RunPod

## Consequences

- ✅ Python = best AI/ML ecosystem
- ✅ FastAPI = production-ready async
- ✅ Easy to test endpoints
- ⚠️ Separate language stack (Python vs TypeScript)
- ⚠️ GPU cost management cần careful

## Related

- [[AI-Pipeline]]
- [[ADR-007-Demucs-Stem-Separation]]
- [[SRS-AI-Analysis]]
- [[SRS-AI-Remix-Engine]]
