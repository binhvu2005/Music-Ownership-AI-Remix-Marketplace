---
title: Workflow — Release
version: 1.0.0
created: 2026-05-26
---

# Release Workflow

> Quy trình release phiên bản mới.

## Pre-Release Checklist

```bash
# 1. Tất cả tests phải pass
npm test

# 2. Coverage đạt target
npm test -- --coverage

# 3. Lint clean
npm run lint

# 4. Build thành công
npm run build

# 5. No security vulnerabilities
npm audit
```

## Steps

### 1. Feature Freeze
- Không thêm feature mới
- Chỉ fix bugs và polish

### 2. Verify
- Chạy full test suite
- Kiểm tra tất cả API endpoints
- Kiểm tra UI trên các screen sizes

### 3. Version Bump
```bash
npm version patch|minor|major
```

### 4. Changelog
- Liệt kê features mới
- Liệt kê bugs đã fix
- Liệt kê breaking changes (nếu có)

### 5. Deploy
- Push to staging
- Smoke test on staging
- Push to production

### 6. Post-Release
- Monitor logs
- Retrospective → `.obsidian-vault/07-Superpowers/Retrospective/`

## Checklist

```
[ ] All tests pass?
[ ] Coverage ≥ target?
[ ] Lint clean?
[ ] Build clean?
[ ] No security vulnerabilities?
[ ] Changelog written?
[ ] Deployed to staging?
[ ] Smoke tested?
[ ] Deployed to production?
[ ] Retro scheduled?
```
