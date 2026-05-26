---
title: Workflow — Bug Fix
version: 1.0.0
created: 2026-05-26
---

# Workflow — Bug Fix

## Quy trình sửa bug

```
[Reproduce] → [Root Cause] → [Failing Test] → [Fix] → [Verify] → [Done]
```

## BƯỚC 1: Reproduce Bug

```bash
# Chạy test liên quan
npm test -- --testPathPattern={module}

# Hoặc reproduce thủ công + capture error
```

## BƯỚC 2: Root Cause Analysis

Trước khi sửa, phải trả lời:
1. Bug xảy ra ở đâu? (service, controller, DB query?)
2. Tại sao nó xảy ra?
3. Scope của fix? (Sẽ affect gì khác?)

## BƯỚC 3: Viết Failing Test

```typescript
// Viết test chứng minh bug tồn tại
it('should NOT allow remix when remix_allowed is false', async () => {
  // Arrange: song với remix_allowed = false
  const song = { id: 'song-1', remix_allowed: false };
  mockPrisma.song.findUnique.mockResolvedValue(song);
  
  // Act & Assert: phải throw ForbiddenException
  await expect(service.createRemix('song-1', 'user-1'))
    .rejects.toThrow(ForbiddenException);
});

// Run: npm test → phải FAIL (RED)
```

## BƯỚC 4: Implement Fix

Fix tối thiểu nhất để test pass. Không thêm features.

```bash
# Verify fix
npm test -- --testNamePattern="{test name}"
# Phải PASS (GREEN)

# Run full suite
npm test
# Toàn bộ phải PASS
```

## BƯỚC 5: Commit

```bash
git commit -m "fix({scope}): {brief description of what was wrong}"
```

## BƯỚC 6: Update Obsidian

- Nếu bug reveal edge case chưa được document → Update SRS
- Nếu là recurring bug → Add to Retrospective notes
