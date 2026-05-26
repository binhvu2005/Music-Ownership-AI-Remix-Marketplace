---
title: Workflow — Feature Development
version: 1.0.0
created: 2026-05-26
---

# Workflow — Feature Development

> Đây là quy trình chuẩn để implement một feature mới trong StemVerse.
> **KHÔNG** được bỏ qua bất kỳ bước nào.

## Quy trình 5 bước

```
[BƯỚC 1: Spec] → [BƯỚC 2: Plan] → [BƯỚC 3: Môi trường] → [BƯỚC 4: TDD] → [BƯỚC 5: Hoàn tất]
```

---

## BƯỚC 1: Spec & Brainstorm

**Câu hỏi cần trả lời trước khi code:**

1. Feature này giải quyết vấn đề gì?
2. Spec có trong `.obsidian-vault/02-SRS/` chưa?
3. Architecture có trong `.obsidian-vault/03-Architecture/` chưa?
4. ADR có liên quan nào cần đọc?
5. DB schema thay đổi gì?
6. API contract là gì?
7. Edge cases cần handle?
8. Acceptance Criteria là gì?

**Action:** Tạo hoặc update Spec file, xác nhận với dev trước khi tiếp tục.

---

## BƯỚC 2: Implementation Plan

Tạo file plan tại: `.obsidian-vault/07-Superpowers/Plans/YYYY-MM-DD-{feature}-plan.md`

**Template:**

```markdown
---
type: implementation-plan
status: ready
module: {feature-name}
date: YYYY-MM-DD
---

# Plan: {Feature Name}

## Objective
1 câu ngắn gọn.

## Approved Spec
[[SRS-{Module}]]

## Tasks

### Task 1: Write failing test for [behavior]
- File: `src/{feature}/{feature}.service.spec.ts`
- Test: `it('should ...', ...)`
- Expected: RED (FAIL)
- Command: `npm test -- --testNamePattern="should ..."`

### Task 2: Implement minimal code
- File: `src/{feature}/{feature}.service.ts`
- Logic: [describe minimally]
- Expected: GREEN (PASS)

### Task 3: Write API integration test
- File: `test/{feature}.e2e-spec.ts`

### Task 4: Implement controller + DTO
- File: `src/{feature}/{feature}.controller.ts`
- File: `src/{feature}/dto/{action}-{feature}.dto.ts`

### Task 5: Run full suite + coverage
- Command: `npm test -- --coverage`
- Expected: ≥ 85% coverage, 0 failures
```

---

## BƯỚC 3: Isolated Workspace

```bash
# Tạo branch mới
git checkout -b feature/{feature-name}

# Chạy baseline tests để đảm bảo môi trường sạch
npm test
# Nếu có failures → STOP và báo cáo ngay

# Setup fresh environment nếu cần
npm install
npx prisma migrate dev
```

---

## BƯỚC 4: TDD Execution

Thực hiện từng task trong plan file. Sau mỗi task:

```bash
# 🔴 RED Phase
npm test -- --testNamePattern="{test name}"
# Phải thấy FAIL

# 🟢 GREEN Phase (sau khi viết code tối thiểu)
npm test -- --testNamePattern="{test name}"
# Phải thấy PASS

# 🔵 REFACTOR
npm test  # Full suite - phải PASS
npm run lint  # 0 errors
```

Cập nhật task status trong plan file:
- `[ ]` → `[/]` khi đang làm
- `[/]` → `[x]` khi xong

---

## BƯỚC 5: Finishing & Integration

```bash
# 1. Run full test suite
npm test -- --coverage
# Required: 0 failures, ≥ 85% coverage

# 2. Lint check
npm run lint
# Required: 0 errors

# 3. Build check
npm run build
# Required: successful build

# 4. Update Obsidian docs
# - Update SRS if Acceptance Criteria changed
# - Update API doc if contract changed
# - Update DB doc if schema changed

# 5. Commit với format chuẩn
git add .
git commit -m "feat({scope}): {description}"

# 6. Push
git push -u origin feature/{feature-name}
```

---

## Checklist trước khi báo cáo Done

Xem `.superpowers/review-checklist.md` và chạy toàn bộ checklist.
