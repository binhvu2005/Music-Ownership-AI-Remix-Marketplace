---
title: Workflow — Refactor
version: 1.0.0
created: 2026-05-26
---

# Workflow — Refactor

## Rules

1. **Tests phải green trước khi refactor**
2. **Tests phải green sau khi refactor**
3. Refactor KHÔNG thay đổi behavior — chỉ thay đổi structure/readability

## Quy trình

```bash
# 1. Chạy tests trước
npm test
# Phải green

# 2. Refactor (từng bước nhỏ)

# 3. Chạy tests sau mỗi thay đổi nhỏ
npm test
# Phải vẫn green

# 4. Commit khi xong
git commit -m "refactor({scope}): {description}"
```

## Common Refactors

### Extract Service Method
```typescript
// BEFORE: Logic trong controller
@Post()
async create(@Body() dto) {
  const validated = await validateAudio(dto.fileKey);
  if (!validated) throw new BadRequestException();
  return this.songsService.create(dto);
}

// AFTER: Move validation to service
@Post()
async create(@Body() dto) {
  return this.songsService.createWithValidation(dto);
}
```

### Extract Constants
```typescript
// BEFORE
if (bpm > 300 || bpm < 1) throw new Error();

// AFTER
const BPM_MIN = 1;
const BPM_MAX = 300;
if (bpm > BPM_MAX || bpm < BPM_MIN) throw new Error();
```
