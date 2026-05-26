# 📐 Superpowers — Implementation Plans

> Plan chi tiết để AI agent thực thi.
> Flow: Brainstorming → Spec → **Plan** → Code

## Template

```markdown
## Plan: [Feature Name]
**Ngày:** YYYY-MM-DD
**Spec:** [[Specs/xxx]]
**Estimated Files:** N files
**Estimated Tests:** M tests

### Steps
1. [ ] Create DTOs
2. [ ] 🔴 RED: Write failing tests
3. [ ] 🟢 GREEN: Implement service
4. [ ] Create controller
5. [ ] Create module & wire up
6. [ ] 🔵 REFACTOR: Clean up
7. [ ] Verify: tests + build + coverage

### Files to Create/Modify
- `[NEW] src/xxx/xxx.service.ts`
- `[NEW] src/xxx/xxx.service.spec.ts`
- `[MODIFY] src/app.module.ts`
```

## Plans

| Plan | Feature | Status |
|------|---------|--------|
| Plan-Auth | Authentication Service | ✅ Done |

## Completed Plans
- [[Plan-Auth]] — 21 tests, 90%+ coverage, build clean
