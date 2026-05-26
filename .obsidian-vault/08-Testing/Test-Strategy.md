---
title: Test Strategy — StemVerse
created: 2026-05-26
status: Active
tags:
  - testing
  - tdd
  - strategy
---

# 🧪 Test Strategy — StemVerse

## Philosophy

> Tests are not optional. Tests are the proof that code works.
> Without proof, there is no done.

---

## Test Pyramid

```
          ╱ E2E Tests ╲          (Playwright — Phase 2)
         ╱─────────────╲
        ╱ Integration    ╲       (Jest + Supertest)
       ╱───────────────────╲
      ╱ Unit Tests           ╲   (Jest — primary)
     ╱─────────────────────────╲
```

---

## Test Types

| Type | Location | Tools | Coverage Target |
|------|---------|-------|-----------------|
| Unit | `*.spec.ts` cùng folder | Jest | ≥ 85% |
| Integration | `test/*.e2e-spec.ts` | Jest + Supertest | Key flows |
| E2E | Phase 2 | Playwright | Critical paths |

---

## TDD Workflow (MANDATORY)

```
1. 🔴 RED:     Viết test mô tả hành vi → chạy → FAIL
2. 🟢 GREEN:   Viết code tối thiểu để pass → chạy → PASS
3. 🔵 REFACTOR: Clean up, improve names → chạy → still PASS
```

> **Rule:** NO failing test → NO production code

---

## Coverage Requirements

| Module | Target |
|--------|--------|
| Overall | ≥ 85% |
| Critical paths (royalty, ownership) | ≥ 95% |
| Auth | ≥ 90% |
| API handlers | ≥ 80% |

---

## What to Mock

| Dependency | Strategy |
|-----------|----------|
| PrismaService | `jest-mock-extended` `mockDeep<PrismaService>()` |
| Redis/BullMQ | `jest.fn()` for queue.add |
| R2Service | `jest.fn()` for getSignedUrl |
| Stripe | `jest.fn()` for stripe.paymentIntents.create |
| External HTTP | `nock` or `jest.mock` |

**NEVER** dùng real database trong unit tests.
**ALWAYS** dùng real database trong integration tests.

---

## Commands

```bash
# Run all tests
npm test

# Run specific module
npx jest src/auth/

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

---

## Related
- [[Authentication-Service]] — 21 tests PASS, 90%+ coverage
- [[Business-Rules]] — Critical paths cần 95%+ coverage
