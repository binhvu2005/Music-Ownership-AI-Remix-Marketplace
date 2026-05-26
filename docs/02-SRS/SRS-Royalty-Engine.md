---
title: SRS — Royalty Distribution Engine
type: spec
project: StemVerse
module: royalty-engine
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - royalty
  - payment
  - distribution
---

# SRS — Royalty Distribution Engine

## Problem

Sau mỗi revenue event (stream, license purchase, marketplace sale), cần tự động chia tiền cho đúng parties theo ownership graph mà không cần can thiệp thủ công.

## Goal

Xây dựng Royalty Distribution Engine:
- Tự động trigger sau mỗi revenue event
- Traverse ownership graph để tính split
- Credit virtual wallets
- Monthly/threshold payout

## Scope

**In scope:**
- Auto royalty calculation sau mỗi event
- Virtual wallet per user
- Monthly payout trigger (cron job)
- Manual payout request
- Royalty history dashboard
- Stripe + MoMo + VNPay payout

**Out of scope:**
- Tax reporting (Phase 2)
- Multi-currency conversion (Phase 2)
- Blockchain royalty (Phase 3)

## User Flow

Xem [[Flow-Royalty-Split]]

## Technical Design

### Event-Driven Architecture

```
Revenue Event (License Purchase / Stream)
            ↓
[Event Bus: Redis Pub/Sub]
            ↓
[Royalty Service] Subscribe to events
            ↓
[Calculate splits]:
  1. Load ownership_relations for song
  2. Platform fee = event.amount × 10%
  3. Remaining = event.amount × 90%
  4. Traverse ownership tree → distribute
            ↓
[Create royalty_transactions] (one per party)
            ↓
[Update user wallets]
            ↓
[Emit: royalty.credited event]
            ↓
[Notification Service] → WebSocket + Email
```

### Royalty Calculation Algorithm

```python
def calculate_royalty(song_id: str, revenue: int) -> List[RoyaltySplit]:
    platform_fee = revenue * 0.10
    distributable = revenue * 0.90
    
    # Get ownership chain for this song
    chain = get_ownership_chain(song_id)  # recursive CTE
    
    splits = [{"party": "platform", "amount": platform_fee}]
    
    remaining = distributable
    for level in chain:
        owner_share = remaining * level.split_percentage / 100
        splits.append({
            "party": level.owner_id,
            "amount": owner_share,
            "role": level.role  # "creator" or "remixer"
        })
        remaining -= owner_share
    
    return splits
```

### Payout Schedule

| Trigger | Condition |
|---------|-----------|
| Monthly Auto | 1st of each month, balance ≥ $50 |
| Manual Request | User initiates, balance ≥ $50 |
| Immediate | Balance ≥ $1000 (high earner) |

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/royalty/wallet` | User | Lấy wallet balance |
| GET | `/royalty/transactions` | User | History royalty transactions |
| GET | `/royalty/dashboard` | Creator | Analytics: streams, earnings, trending |
| POST | `/royalty/payout/request` | User | Yêu cầu manual payout |
| GET | `/royalty/payout/history` | User | Lịch sử payout |
| GET | `/royalty/songs/:songId/breakdown` | Creator | Royalty breakdown cho 1 song |

## Database

```sql
-- royalty_transactions table
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
song_id         UUID REFERENCES songs(id)
event_type      ENUM('stream','license_purchase','marketplace_sale','subscription_pool')
event_id        UUID NOT NULL            -- ID của event gốc
role            ENUM('original_creator','remixer','platform')
gross_amount    INTEGER NOT NULL         -- cents
platform_fee    INTEGER NOT NULL         -- cents
net_amount      INTEGER NOT NULL         -- cents (gross - fee)
currency        VARCHAR(3) DEFAULT 'USD'
status          ENUM('pending','credited','paid')
created_at      TIMESTAMP DEFAULT NOW()

-- user_wallets table
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id) UNIQUE
balance_usd     INTEGER DEFAULT 0        -- cents
total_earned    INTEGER DEFAULT 0        -- cents (lifetime)
total_paid      INTEGER DEFAULT 0        -- cents
updated_at      TIMESTAMP

-- payouts table
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
amount          INTEGER NOT NULL         -- cents
currency        VARCHAR(3) DEFAULT 'USD'
method          ENUM('stripe','momo','vnpay')
status          ENUM('pending','processing','paid','failed')
external_id     VARCHAR(255)             -- stripe transfer ID, etc.
initiated_at    TIMESTAMP DEFAULT NOW()
completed_at    TIMESTAMP
```

## Edge Cases

| Case | Handling |
|------|---------|
| Stream từ free user | Tính từ subscription pool (per-stream rate) |
| Royalty amount < $0.01 | Round up, accumulate to next event |
| Owner không có payout method | Hold funds, email notification |
| Payout gateway fail | Retry 3x, mark failed, notify user |
| User banned mid-payout | Hold payout, admin review |
| Chain depth > 10 | Stop at level 10, remainder goes to platform |

## Acceptance Criteria

- [ ] Mỗi license purchase tạo đúng royalty_transactions
- [ ] Platform fee = 10% của mọi event
- [ ] Chain royalty tính đúng (test với 3 levels)
- [ ] Wallet balance cập nhật ngay sau event
- [ ] Monthly cron job chạy đúng 1st of month
- [ ] Manual payout request khả dụng khi balance ≥ $50
- [ ] Payout history hiển thị đúng

## Related

- [[Business-Rules]]
- [[Flow-Royalty-Split]]
- [[SRS-Ownership-Graph]]
- [[SRS-Licensing]]
- [[API-Royalty]]
- [[Table-Royalty-Transactions]]
- [[ADR-008-Stripe-Payment]]
