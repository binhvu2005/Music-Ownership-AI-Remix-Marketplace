---
title: Workflow — Feature Development
version: 1.0.0
created: 2026-05-26
---

# Feature Development Workflow

> Quy trình phát triển feature từ ý tưởng đến production.

## Prerequisites
- [ ] Có SRS cho feature này trong `.obsidian-vault/02-SRS/`
- [ ] Có ADR nếu cần quyết định kỹ thuật

## Steps

### 1. 📋 Brainstorming
```
Lưu tại: .obsidian-vault/07-Superpowers/Brainstorming/
```
- Xác định vấn đề cần giải quyết
- Liệt kê ý tưởng giải pháp
- Chọn approach tốt nhất

### 2. 📐 Spec
```
Lưu tại: .obsidian-vault/07-Superpowers/Specs/
```
- Viết spec chi tiết từ SRS
- Xác định actors, input, output
- Liệt kê edge cases
- Viết acceptance criteria

### 3. 📝 Plan
```
Lưu tại: .obsidian-vault/07-Superpowers/Plans/
```
- Liệt kê files cần tạo/sửa
- Ước tính số tests
- Xác định dependencies
- Tạo step-by-step checklist

### 4. 🔴 TDD — RED Phase
- Viết tất cả test cases mô tả hành vi
- Chạy tests → tất cả FAIL (expected)
- **Evidence:** Lưu output test vào TDD log

### 5. 🟢 TDD — GREEN Phase
- Viết code tối thiểu để pass tests
- Chạy tests → tất cả PASS
- **Evidence:** Lưu output test

### 6. 🔵 TDD — REFACTOR Phase
- Clean up code
- Improve naming
- Thêm tests nếu cần
- Chạy tests → vẫn PASS
- Kiểm tra coverage ≥ target

### 7. 🔍 Code Review
```
Lưu tại: .obsidian-vault/07-Superpowers/Code-Review/
```
- Self-review theo `.superpowers/review-checklist.md`
- Kiểm tra security theo `.superpowers/security-rules.md`

### 8. ✅ Verification
```bash
npm test                    # All tests pass
npm test -- --coverage      # Coverage ≥ target
npm run lint                # No lint errors
npm run build               # Build succeeds
```

### 9. 📚 Knowledge
- Cập nhật API docs → `.obsidian-vault/05-API/`
- Cập nhật DB docs nếu schema thay đổi → `.obsidian-vault/06-Database/`
- Cập nhật Dashboard → `.obsidian-vault/00-Dashboard/`

## Checklist Tóm tắt

```
[ ] SRS exists?
[ ] Spec written?
[ ] Plan written?
[ ] Tests written (RED)?
[ ] Code written (GREEN)?
[ ] Refactored (BLUE)?
[ ] Code reviewed?
[ ] All tests pass?
[ ] Coverage ≥ target?
[ ] Build clean?
[ ] Knowledge updated?
```
