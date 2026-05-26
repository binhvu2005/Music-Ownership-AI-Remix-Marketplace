---
title: Workflow — Bug Fix
version: 1.0.0
created: 2026-05-26
---

# Bug Fix Workflow

> Quy trình sửa bug theo phương pháp TDD.

## Steps

### 1. 🔍 Reproduce
- Xác nhận bug có thể tái tạo
- Ghi lại steps to reproduce
- Ghi lại expected vs actual behavior

### 2. 🔴 Write Failing Test
- Viết test case mô tả **đúng** hành vi mong muốn
- Chạy test → FAIL (chứng minh bug tồn tại)

### 3. 🟢 Fix the Bug
- Viết code tối thiểu để fix
- Chạy test → PASS

### 4. 🔵 Verify No Regression
```bash
npm test            # Tất cả tests cũ vẫn pass
npm run build       # Build vẫn thành công
```

### 5. 📚 Document
- Ghi lại root cause
- Cập nhật knowledge nếu cần

## Checklist

```
[ ] Bug reproduced?
[ ] Failing test written?
[ ] Bug fixed?
[ ] All existing tests still pass?
[ ] Build clean?
[ ] Root cause documented?
```
