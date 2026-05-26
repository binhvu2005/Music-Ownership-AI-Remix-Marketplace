---
title: ADR-001 — Use Next.js App Router for Frontend
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, frontend, nextjs]
---

# ADR-001 — Use Next.js App Router for Frontend

## Status: Accepted ✅

## Context

Cần chọn framework frontend cho StemVerse. Yêu cầu:
- SSR cho SEO (track pages cần indexable)
- Fast navigation (SPA feel)
- TypeScript support
- Tích hợp tốt với Tailwind CSS

## Decision

Dùng **Next.js 15 với App Router**.

## Reasons

| Reason | Detail |
|--------|-------|
| SSR/SSG | Track detail pages SEO-optimized |
| App Router | Server Components = better performance |
| Ecosystem | Lớn nhất React ecosystem |
| Vercel deploy | Zero-config deploy |
| TypeScript first | Native TS support |

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| Vite + React SPA | No SSR, SEO kém |
| Remix | Smaller ecosystem |
| Nuxt.js | Vue ecosystem, team không quen |

## Consequences

- ✅ SEO tốt cho music discovery pages
- ✅ Server Components giảm JS bundle
- ✅ Image, Font optimization built-in
- ⚠️ App Router learning curve (complex caching)
- ⚠️ Solo dev phải tự handle streaming patterns

## Related

- [[Frontend-Architecture]]
- [[System-Architecture]]
