---
title: Review Checklist — StemVerse
version: 1.0.0
created: 2026-05-26
---

# Review Checklist — StemVerse

> Chạy checklist này TRƯỚC KHI báo cáo hoàn thành bất kỳ feature nào.

## ✅ Iron Laws Check

- [ ] **Spec tồn tại** và đã được xem qua trước khi code
  - Spec file: `.obsidian-vault/02-SRS/SRS-{module}.md`
- [ ] **Failing tests viết trước** (không có code nào viết trước test)
- [ ] **Có evidence**: test output với 0 failures (copy paste actual output)

---

## ✅ Code Quality

- [ ] TypeScript: không có `any` type
- [ ] Không có `console.log` còn sót lại trong production code
- [ ] Không có `TODO`, `FIXME`, `HACK` comments chưa được xử lý
- [ ] Error handling: dùng đúng NestJS exceptions
- [ ] Tất cả async functions có `await` đúng chỗ
- [ ] Không có unused imports
- [ ] `npm run lint` pass 0 errors

---

## ✅ Testing

- [ ] Unit tests cho tất cả service methods (public)
- [ ] Integration test cho API endpoints
- [ ] `npm test` pass với 0 failures
- [ ] Coverage ≥ 85% cho module mới
- [ ] Edge cases đã được test (null, empty, boundary values)
- [ ] External services đã được mock (không gọi real Stripe/R2 trong unit test)

---

## ✅ Security

- [ ] Route có `@UseGuards(JwtAuthGuard)` nếu cần auth
- [ ] Ownership verified trước khi mutation
- [ ] Input validated với DTO (class-validator)
- [ ] Audio access dùng signed URLs, không direct
- [ ] Không có secrets trong code
- [ ] Rate limiting applied (via gateway)

---

## ✅ Database

- [ ] Migration file được tạo đúng (`npx prisma migrate dev`)
- [ ] Indexes đã được thêm cho FK và query fields
- [ ] Transactions dùng cho multi-step operations
- [ ] Money stored as integer cents (không phải float)
- [ ] `ownership_relations` KHÔNG có update operations

---

## ✅ Business Logic

- [ ] Platform fee = 10% đúng
- [ ] Royalty split tổng = 100%
- [ ] Remix chỉ cho bài có `remix_allowed = true`
- [ ] Exclusive license auto-disable sau khi bán
- [ ] Ownership record immutable

---

## ✅ API Contract

- [ ] Response format khớp với spec trong `.obsidian-vault/05-API/`
- [ ] HTTP status codes đúng (200, 201, 400, 401, 403, 404)
- [ ] Pagination implemented cho list endpoints
- [ ] Error response format nhất quán

---

## ✅ Git

- [ ] Commit message format đúng: `feat(scope): description`
- [ ] Không có merge conflicts
- [ ] Branch name: `feature/{feature-name}` hoặc `fix/{bug-name}`

---

## ✅ Documentation Update

- [ ] Obsidian vault cập nhật nếu có thay đổi:
  - SRS thay đổi → update `.obsidian-vault/02-SRS/`
  - API thay đổi → update `.obsidian-vault/05-API/`
  - DB thay đổi → update `.obsidian-vault/06-Database/`
  - Architecture thay đổi → update `.obsidian-vault/03-Architecture/`

---

## 📋 Done Template

Khi báo cáo hoàn thành, dùng template này:

```
## Feature: [Feature Name]

### Evidence
```
npm test output (paste actual output):
✓ SongsService > create > should create song (15ms)
✓ SongsService > create > should reject non-creator (8ms)
Tests: 24 passed, 0 failed
Coverage: 87.3%
```

### Spec Compliance
- [x] Acceptance criteria #1: [description]
- [x] Acceptance criteria #2: [description]
- [x] Edge case: [description]

### Changes Made
- `src/songs/songs.service.ts` — Added create method
- `src/songs/songs.service.spec.ts` — 8 unit tests
- `test/songs.e2e-spec.ts` — 3 integration tests
- `prisma/migrations/...` — Added songs table

### Notes
[Any important notes, trade-offs, or things to watch out for]
```
