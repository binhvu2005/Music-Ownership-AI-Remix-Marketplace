---
title: Workflow — Release
version: 1.0.0
created: 2026-05-26
---

# Workflow — Release

## Pre-Release Checklist

```bash
# 1. Full test suite
npm test -- --coverage
# Required: 0 failures, ≥ 85% overall coverage

# 2. Lint
npm run lint
# 0 errors

# 3. Build
npm run build
# Successful

# 4. Security check
npm audit
# 0 high/critical vulnerabilities

# 5. Environment variables
# - Verify .env.example is up to date
# - Verify all required vars in production env

# 6. Database migrations
npx prisma migrate deploy  # (production)
```

## Release Steps

```bash
# Tag version
git tag v{major}.{minor}.{patch}
git push origin v{major}.{minor}.{patch}

# Deploy (CI/CD handles this automatically)
```

## Versioning (SemVer)

| Type | Version Change | Example |
|------|---------------|---------|
| Breaking API change | MAJOR | 1.0.0 → 2.0.0 |
| New feature | MINOR | 1.0.0 → 1.1.0 |
| Bug fix | PATCH | 1.0.0 → 1.0.1 |

## Post-Release

- [ ] Update CHANGELOG.md
- [ ] Update Obsidian Roadmap
- [ ] Note any issues in Retrospective
