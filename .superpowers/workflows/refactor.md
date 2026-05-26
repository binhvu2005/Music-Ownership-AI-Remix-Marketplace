---
title: Workflow — Refactoring
version: 1.0.0
created: 2026-05-26
---

# Refactoring Workflow

> Quy trình refactor code an toàn — không thay đổi behavior.

## Golden Rule

> **Refactoring = thay đổi structure, KHÔNG thay đổi behavior.**
> Tests trước và sau refactor phải cho kết quả **giống hệt nhau**.

## Steps

### 1. ✅ Verify Tests Pass BEFORE
```bash
npm test            # Ghi nhận baseline
npm test -- --coverage   # Ghi nhận coverage baseline
```

### 2. 🔍 Identify Refactoring Target
- Code smell? (duplication, long methods, god class)
- Performance issue?
- Naming không rõ ràng?
- Dependency quá phức tạp?

### 3. 🔧 Refactor
- Thay đổi từng bước nhỏ
- Chạy tests sau mỗi bước
- **KHÔNG thêm feature mới**
- **KHÔNG sửa bug** (đó là bug-fix workflow)

### 4. ✅ Verify Tests Pass AFTER
```bash
npm test            # Phải giống baseline
npm test -- --coverage   # Coverage >= baseline
npm run build       # Build clean
```

### 5. 📚 Document
- Ghi lại lý do refactor
- Ghi lại improvement metrics (if any)

## Checklist

```
[ ] All tests pass BEFORE refactor?
[ ] Refactoring scope clear?
[ ] No behavior changes?
[ ] All tests pass AFTER refactor?
[ ] Coverage >= before?
[ ] Build clean?
```
