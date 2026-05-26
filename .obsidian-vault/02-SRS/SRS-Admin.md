---
title: SRS — Admin Panel
type: spec
project: StemVerse
module: admin
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - admin
  - moderation
---

# SRS — Admin Panel

## Problem

Solo developer cần admin panel để quản lý platform: moderation, DMCA, disputes, payments.

## Goal

Xây dựng Admin Panel:
- Dashboard tổng quan platform
- Content moderation
- DMCA + dispute management
- Payment management
- User management

## Scope

**In scope:**
- Platform metrics dashboard
- User management (ban/unban/verify)
- Content moderation (remove tracks)
- DMCA takedown queue
- Dispute resolution
- Payment/Payout oversight

## Technical Design

### Admin Access Control

```
Admin roles:
- super_admin  → Full access
- moderator    → Content + DMCA only
- finance      → Payment oversight only
```

### DMCA Workflow

```
User reports DMCA
      ↓
[Admin] Review in queue
      ↓
  Decision:
  ├── Valid → Remove content, notify both parties
  ├── Counter-notice received → 10-day waiting period
  └── Invalid → Dismiss, notify reporter
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/admin/dashboard` | Admin | Platform metrics |
| GET | `/admin/users` | Admin | Danh sách users |
| PUT | `/admin/users/:id/ban` | Admin | Ban user |
| PUT | `/admin/users/:id/verify` | Admin | Verify creator |
| GET | `/admin/dmca` | Admin | DMCA queue |
| PUT | `/admin/dmca/:id/resolve` | Admin | Resolve DMCA |
| GET | `/admin/disputes` | Admin | Dispute queue |
| GET | `/admin/payouts` | Finance | Payout oversight |
| DELETE | `/admin/songs/:id` | Moderator | Remove content |

## Database

```sql
-- dmca_reports table
id              UUID PRIMARY KEY
reporter_id     UUID REFERENCES users(id)
song_id         UUID REFERENCES songs(id)
reason          TEXT NOT NULL
evidence_url    TEXT
status          ENUM('pending','reviewing','resolved','dismissed')
resolved_by     UUID REFERENCES users(id) NULL
resolved_at     TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()

-- disputes table
id              UUID PRIMARY KEY
type            ENUM('ownership','payment','content')
party_a_id      UUID REFERENCES users(id)
party_b_id      UUID REFERENCES users(id)
song_id         UUID REFERENCES songs(id) NULL
description     TEXT
status          ENUM('open','reviewing','resolved')
resolution      TEXT
admin_id        UUID REFERENCES users(id) NULL
created_at      TIMESTAMP DEFAULT NOW()
```

## Acceptance Criteria

- [ ] Admin dashboard hiển thị: total users, total songs, total revenue
- [ ] DMCA queue accessible và actionable trong 48 giờ
- [ ] Ban user disable tất cả active licenses
- [ ] Content removal cascade: ẩn khỏi search, disable download

## Related

- [[Business-Rules]]
- [[SRS-Licensing]]
- [[SRS-Royalty-Engine]]
- [[API-Admin]]
