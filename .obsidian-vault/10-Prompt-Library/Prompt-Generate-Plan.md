---
title: Prompt Library — Generate Implementation Plan
author: Solo Developer
created: 2026-05-26
tags: [prompt, ai, plan]
---

# Prompt Library — Generate Implementation Plan

## Prompt: Tạo Implementation Plan

```
Tôi đang implement {FEATURE} trong StemVerse theo Superpowers methodology.

Spec đã approved:
{PASTE SRS HERE}

Hãy tạo Implementation Plan theo cấu trúc sau:
- Mỗi task = 2-5 phút thực hiện
- Mỗi task phải có: file cần tạo/sửa + test case mong muốn + lệnh chạy test
- Bắt đầu từ failing test (TDD Red Phase)

Format:

---
type: implementation-plan
status: ready
module: {module}
date: {date}
---

# Plan: {Feature}

## Objective
1 câu.

## Approved Spec
[[SRS-{Module}]]

## Tasks

### Task 1.1: Write failing test for [behavior]
- File: `src/{service}/{service}.spec.ts`
- Test:
```typescript
it('should ...', async () => {
  // arrange
  // act
  // assert
});
```
- Command: `npm test -- --testNamePattern="should ..."`
- Expected: FAIL (RED)

### Task 1.2: Implement minimal code
- File: `src/{service}/{service}.ts`
- Logic: [minimal description]
- Command: `npm test -- --testNamePattern="should ..."`
- Expected: PASS (GREEN)

[continue...]
```

## Prompt: Estimate Task Complexity

```
Tôi đang plan sprint cho StemVerse (solo developer).

Features cần implement trong Phase 1:
{LIST OF FEATURES}

Estimate cho mỗi feature:
- Complexity: S/M/L/XL
- Estimated days (1 person)
- Dependencies
- Risks

Tech stack: NestJS + Next.js + FastAPI + PostgreSQL + Redis + Cloudflare R2
```
