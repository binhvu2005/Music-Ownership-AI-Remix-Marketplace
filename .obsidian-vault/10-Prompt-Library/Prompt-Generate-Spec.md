---
title: Prompt Library — Generate Spec
author: Solo Developer
created: 2026-05-26
tags: [prompt, ai, spec]
---

# Prompt Library — Generate Spec

## Prompt: Tạo SRS Document

```
Tôi đang xây dựng StemVerse — AI-powered Music Ownership & Remix Marketplace.

Tôi cần bạn tạo SRS (Software Requirements Specification) cho module: {MODULE_NAME}

Context:
- Tech stack: Next.js 15, NestJS, FastAPI, PostgreSQL, Redis, Cloudflare R2
- Business rules: Platform fee 10%, ownership_relations IMMUTABLE, remix cần song.remix_allowed=true

Tạo SRS theo cấu trúc sau:

---
title: SRS — {Module Name}
type: spec
project: StemVerse
module: {module-slug}
status: Draft
owner: solo-dev
created: {date}
---

# SRS — {Module Name}

## Problem
(Vấn đề gì đang giải quyết?)

## Goal
(Mục tiêu cụ thể)

## Scope
**In scope:**
- ...

**Out of scope:**
- ...

## User Flow
(Luồng user step by step)

## Technical Design
(Architecture, data flow)

## API
| Method | Endpoint | Auth | Mô tả |

## Database
(SQL schema)

## Edge Cases
| Case | Handling |

## Acceptance Criteria
- [ ] ...

## Related
- [[...]]
```

## Prompt: Brainstorm Edge Cases

```
Tôi đang implement {FEATURE} trong StemVerse.

Current design:
{PASTE SPEC HERE}

Hãy liệt kê các edge cases tôi có thể bỏ sót:
1. Concurrent access issues
2. Race conditions
3. Error states
4. Boundary values
5. Security vulnerabilities
6. Business rule violations
```

## Prompt: Validate Spec Against Business Rules

```
Review SRS này cho StemVerse:

{PASTE SRS HERE}

Check against business rules:
1. Platform fee = 10% luôn luôn
2. Ownership records IMMUTABLE
3. Remix yêu cầu song.remix_allowed = true
4. AI Voice cloning celebrities = PROHIBITED
5. Money stored as integer cents
6. Signed URLs cho mọi audio access

Có violation nào không?
```
