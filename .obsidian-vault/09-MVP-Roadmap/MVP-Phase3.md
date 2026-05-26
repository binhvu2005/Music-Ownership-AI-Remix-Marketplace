---
title: MVP Phase 3 — Long-Term Vision
author: Solo Developer
created: 2026-05-26
status: Future
tags: [mvp, phase3, roadmap, vision]
---

# MVP Phase 3 — Long-Term Vision

> [!NOTE]
> Phase 3 là tầm nhìn dài hạn. Chỉ bắt đầu khi có traction và revenue từ Phase 1+2.

## Features

| Feature | Priority | Notes |
|---------|---------|-------|
| Mobile App (React Native) | P1 | iOS + Android |
| Investor Royalty Shares | P1 | Fan investment model |
| Blockchain Ownership Proof | P2 | Immutable proof on-chain |
| Advanced AI Generation | P2 | Full song generation from scratch |
| Label/Enterprise Tier | P3 | B2B licensing |

## Blockchain Strategy

Blockchain KHÔNG phải core database. Dùng như:
- **Proof layer**: Anchor ownership records on-chain
- **Tech**: Polygon (low gas fees) hoặc Base
- **Pattern**: Hash ownership_relations → store on-chain

```
PostgreSQL (source of truth) → Hash → Blockchain (proof)
```

## Related

- [[MVP-Phase1]]
- [[MVP-Phase2]]
- [[StemVerse-Overview]]
