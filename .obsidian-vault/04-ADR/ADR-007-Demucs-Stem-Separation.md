---
title: ADR-007 — Use Demucs for Stem Separation
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, ai, demucs, stem-separation]
---

# ADR-007 — Use Demucs (HTDemucs) for Stem Separation

## Status: Accepted ✅

## Context

StemVerse cần tách audio thành stems (vocals, drums, bass, other). Chất lượng tách stems ảnh hưởng trực tiếp đến chất lượng AI remix.

## Decision

Dùng **Demucs (HTDemucs model)** làm primary stem separation engine. Fallback sang **Spleeter** khi GPU OOM.

## Models Comparison

| Model | Quality | Speed | VRAM | License |
|-------|---------|-------|------|---------|
| **HTDemucs** | ⭐⭐⭐⭐⭐ | Slow (GPU) | 4–8 GB | MIT |
| Demucs v3 | ⭐⭐⭐⭐ | Medium | 2–4 GB | MIT |
| Spleeter 4-stem | ⭐⭐⭐ | Fast | <1 GB | MIT |
| Open-Unmix | ⭐⭐⭐ | Medium | 2 GB | MIT |

## Decision Rationale

HTDemucs cho quality tốt nhất = better AI remix quality = better user experience = competitive advantage.

## Fallback Strategy

```python
async def separate_stems(audio_path: str):
    try:
        # Primary: Demucs HTDemucs (requires GPU)
        stems = await run_demucs(audio_path, model="htdemucs")
    except (OOMError, TimeoutError):
        # Fallback: Spleeter 4-stem (CPU-compatible)
        stems = await run_spleeter(audio_path, stems=4)
    return stems
```

## GPU Requirements

| Model | Min VRAM | Recommended |
|-------|---------|-------------|
| HTDemucs (3min song) | 4 GB | 8 GB |
| Demucs v3 | 2 GB | 4 GB |
| Spleeter | CPU | Any |

## Production Setup

```
GPU Workers: Modal.com
- Auto-scale 0 → N instances
- T4 GPU ($0.06/hour) hoặc A10G ($0.90/hour)
- Spot instances để giảm cost
```

## Consequences

- ✅ Best-in-class separation quality
- ✅ MIT license = commercial use OK
- ✅ Spleeter fallback = zero downtime
- ⚠️ GPU required = cost (estimate: $50–$200/month at scale)
- ⚠️ Processing time: 1–3 min per song (3 min song)

## Related

- [[AI-Pipeline]]
- [[SRS-AI-Analysis]]
- [[ADR-003-FastAPI-AI-Service]]
