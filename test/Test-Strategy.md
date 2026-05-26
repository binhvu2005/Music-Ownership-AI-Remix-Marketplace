---
title: Test Strategy — StemVerse
author: Solo Developer
created: 2026-05-26
status: Approved
tags: [testing, strategy, qa]
---

# Test Strategy — StemVerse

## Testing Pyramid

```
         /▲\
        / E2E \          Small number, critical paths
       /───────\
      / Integr. \        API endpoints, DB interactions
     /───────────\
    /  Unit Tests  \     Service logic, utils (majority)
   /───────────────\
```

## Test Types & Coverage Targets

| Type | Target Coverage | Tools | When |
|------|---------------|-------|------|
| Unit | ≥ 85% | Jest | Every feature |
| Integration | Key flows | Jest + Supertest | Every feature |
| E2E | Critical paths | Playwright (Phase 2) | Major milestones |

## Critical Path Tests (Must Never Fail)

| Test | Why Critical |
|------|-------------|
| Royalty calculation formula | Money is involved |
| Ownership record creation | Core business invariant |
| Ownership immutability | Legal requirement |
| License validation | Prevents unauthorized access |
| Auth JWT validation | Security |
| Platform fee = 10% | Financial accuracy |

## Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific module
npm test -- --testPathPattern=songs

# Run specific test
npm test -- --testNamePattern="should create song"

# Watch mode (development)
npm test -- --watch

# E2E tests
npm run test:e2e
```

## Test Database

```
.env.test:
DATABASE_URL=postgresql://user:password@localhost:5432/stemverse_test

Setup:
npx prisma migrate reset --force --skip-seed (test DB)
```

## Mock Strategy

| What | Mock With |
|------|-----------|
| PostgreSQL (unit) | `jest-mock-extended` + `mockDeep<PrismaService>()` |
| Redis (unit) | `jest.fn()` |
| Cloudflare R2 | `jest.fn()` returning fake signed URLs |
| Stripe | `jest.fn()` returning fake payment intents |
| BullMQ | `jest.fn()` for queue.add |
| Real DB (integration) | Test database (no mock) |

## Related

- [[Testcase-Upload]]
- [[Testcase-AI-Remix]]
- [[Testcase-Royalty]]
- `.superpowers/testing-rules.md`
