---
title: SRS — Licensing System
type: spec
project: StemVerse
module: licensing
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - licensing
  - marketplace
---

# SRS — Licensing System

## Problem

Creator cần cơ chế cấu hình và bán quyền sử dụng nhạc của mình. Consumer cần mua license phù hợp với mục đích sử dụng.

## Goal

Xây dựng Licensing System:
- Creator config license types và giá
- Consumer mua license qua payment
- Hệ thống validate license khi stream/download
- License key generation

## Scope

**In scope:**
- 4 loại license: Personal, Commercial, Remix, Exclusive
- Pricing configuration bởi Creator
- License purchase flow
- License validation middleware
- License history (My Licenses)

**Out of scope:**
- NFT-based licenses (Phase 3)
- Negotiated licensing (manual)

## User Flow

Xem [[Flow-Buy-License]]

## Technical Design

### License Types

| Type | `allow_commercial` | `allow_remix` | `allow_exclusive` | Default Price |
|------|-------------------|--------------|------------------|---------------|
| Personal | ❌ | ❌ | ❌ | Free |
| Commercial | ✅ | ❌ | ❌ | $29.99 |
| Remix | ❌ | ✅ | ❌ | $14.99 |
| Exclusive | ✅ | ✅ | ✅ | $499+ |

### License Validation Flow

```
User requests download/stream
        ↓
[Auth Middleware] Verify JWT
        ↓
[License Middleware] Check:
  - user has license for this song?
  - license type allows requested action?
  - license not expired?
        ↓
  ✅ Allow → Generate signed URL (1h)
  ❌ Deny → 403 Forbidden + redirect to buy
```

### License Key Format

```
STMV-{SONG_SHORT_ID}-{LICENSE_TYPE}-{RANDOM_8}
Example: STMV-A1B2-COMM-X9Y8Z7W6
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/licenses/songs/:songId/options` | Public | Lấy license options + giá |
| POST | `/licenses/purchase` | User | Mua license |
| GET | `/licenses/my` | User | Danh sách licenses đã mua |
| GET | `/licenses/:licenseId` | User | Chi tiết một license |
| GET | `/licenses/validate/:songId` | User | Check có license không |
| POST | `/licenses/songs/:songId/config` | Creator | Cấu hình license types và giá |

### POST /licenses/purchase — Request

```json
{
  "song_id": "uuid",
  "license_type": "commercial",
  "payment_method": "stripe",
  "payment_intent_id": "pi_xxx"
}
```

### POST /licenses/songs/:songId/config — Request

```json
{
  "personal": { "price": 0, "enabled": true },
  "commercial": { "price": 2999, "enabled": true },
  "remix": { "price": 1499, "enabled": true },
  "exclusive": { "price": 49900, "enabled": false }
}
```

## Database

```sql
-- song_license_configs table
id              UUID PRIMARY KEY
song_id         UUID REFERENCES songs(id) UNIQUE
personal_price  INTEGER DEFAULT 0         -- cents (0 = free)
commercial_price INTEGER DEFAULT 2999     -- cents
remix_price     INTEGER DEFAULT 1499
exclusive_price INTEGER DEFAULT 49900
personal_enabled  BOOLEAN DEFAULT true
commercial_enabled BOOLEAN DEFAULT true
remix_enabled   BOOLEAN DEFAULT true
exclusive_enabled BOOLEAN DEFAULT false
updated_at      TIMESTAMP

-- user_licenses table
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
song_id         UUID REFERENCES songs(id)
license_type    ENUM('personal','commercial','remix','exclusive')
license_key     VARCHAR(30) UNIQUE
price_paid      INTEGER                   -- cents
currency        VARCHAR(3) DEFAULT 'USD'
payment_id      VARCHAR(255)              -- stripe payment intent id
expires_at      TIMESTAMP NULL            -- null = perpetual
purchased_at    TIMESTAMP DEFAULT NOW()

UNIQUE(user_id, song_id, license_type)

-- Indexes:
-- INDEX ON user_id
-- INDEX ON song_id
-- INDEX ON license_key
```

## Edge Cases

| Case | Handling |
|------|---------|
| Exclusive đã được mua | "Exclusive license sold" — disable option |
| User mua lại cùng loại | Block: "You already have this license" |
| Payment thành công nhưng license không tạo | Webhook retry, idempotency key |
| Creator thay đổi giá sau khi user đã mua | License cũ vẫn valid |
| Creator xóa song | License vẫn valid nhưng download disabled |

## Acceptance Criteria

- [ ] Creator config được giá và enable/disable từng loại license
- [ ] Personal license (miễn phí) không cần payment flow
- [ ] Paid license chỉ tạo sau khi payment success webhook
- [ ] License key unique và được generate đúng format
- [ ] Exclusive license auto-disabled sau khi bán
- [ ] User xem được danh sách tất cả licenses đã mua
- [ ] License validation đúng khi stream/download

## Related

- [[Business-Rules]]
- [[Flow-Buy-License]]
- [[SRS-Royalty-Engine]]
- [[API-Licensing]]
- [[Table-Licenses]]
- [[ADR-008-Stripe-Payment]]
