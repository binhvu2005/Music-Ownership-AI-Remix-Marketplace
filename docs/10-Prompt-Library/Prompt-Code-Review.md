---
title: Prompt Library — Code Review
author: Solo Developer
created: 2026-05-26
tags: [prompt, ai, code-review]
---

# Prompt Library — Code Review

## Prompt: Review NestJS Service

```
Review code này từ StemVerse — Music Ownership + AI Remix Marketplace:

{PASTE CODE HERE}

Check for:
1. Iron Laws compliance:
   - Có spec trước code không?
   - Có failing tests không?
   - Có báo cáo với evidence không?

2. Business Rule Violations:
   - ownership_relations có bị UPDATE không? (FORBIDDEN)
   - Money có stored as integer cents không?
   - Platform fee có phải 10% không?
   - Remix validation: song.remix_allowed check?

3. Security Issues:
   - Route có guard không?
   - Ownership verified trước mutation?
   - Input validated với DTO?
   - Audio served via signed URL?

4. Code Quality:
   - TypeScript: có any type không?
   - Error handling đúng NestJS exceptions?
   - Single responsibility?
   - No business logic in controller?

5. Missing Tests:
   - Các case nào chưa được test?

Đưa ra: APPROVE / REQUEST_CHANGES với feedback cụ thể.
```

## Prompt: Review Database Migration

```
Review Prisma migration này cho StemVerse:

{PASTE MIGRATION HERE}

Check for:
1. Schema đúng với SRS không? (reference: .obsidian-vault/06-Database/)
2. Indexes đầy đủ (FK, query fields)?
3. Money fields là INTEGER không?
4. Timestamps là TIMESTAMPTZ không?
5. constraints đúng (NOT NULL, UNIQUE, CHECK)?
6. ownership_relations không có update migration?

Tech: PostgreSQL 16 + Prisma
```

## Prompt: Review API Endpoint

```
Review API endpoint này cho StemVerse:

{PASTE CONTROLLER CODE HERE}

Check for:
1. Response format khớp với .obsidian-vault/05-API/?
2. HTTP status codes đúng?
3. Auth guard applied?
4. Rate limiting (via gateway)?
5. Validation với DTO?
6. Ownership check trước mutation?
7. Pagination cho list endpoints?
```
