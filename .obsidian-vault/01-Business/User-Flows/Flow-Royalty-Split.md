---
title: Flow — Royalty Split
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - flow
  - royalty
  - payment
  - ownership
---

# Flow — Royalty Split (Automatic Distribution)

## Mục tiêu

Hệ thống tự động chia royalty cho các parties khi có revenue event xảy ra.

---

## Royalty Flow Diagram

```
Revenue Event Occurs
(stream / license purchase / marketplace sale)
          ↓
[Royalty Engine] Receive event
          ↓
[Royalty Engine] Lookup song → ownership_relations table
          ↓
[Royalty Engine] Calculate splits:
     ├── Platform fee: 10%
     ├── Remaining: 90%
     │    └── Distribute theo ownership %
     ├── If original track:
     │    └── Creator: 90% of remaining
     └── If remix:
          ├── Original Creator: 70% of remaining
          └── Remixer: 20% of remaining
          (nested remixes: chain down)
          ↓
[Royalty Engine] Create royalty_transactions records
          ↓
[Royalty Engine] Credit wallets (không transfer ngay)
          ↓
[Notification] Notify parties khi có royalty credit
          ↓
[Monthly/Threshold] Trigger payout job
          ↓
[Payment Service] Transfer to creator bank/wallet
          ↓
[System] Mark royalty as "paid"
          ↓
[Creator] Nhận tiền + email confirmation
```

---

## Revenue Event Types

| Event | Trigger | Amount Basis |
|-------|---------|-------------|
| Stream | User streams track | Subscription pool ÷ streams |
| License Purchase | User buys license | License price |
| Remix Sales | Remix được mua license | Remix license price |
| Marketplace | Stem/loop sold | Asset price |
| Subscription | Monthly subscription | Pool distribution |

---

## Split Calculation Example

**Scenario**: Remix A1 (grandchild) được mua commercial license = $100

```
Total Revenue: $100

Step 1: Platform Fee = $10 (10%)
Remaining: $90

Step 2: Remix A1 split
  - Remixer A1: $90 × 70% = $63
  - Parent (Remix A): $90 × 20% = $18
  - (10% already taken by platform)

Step 3: Remix A's share ($18) split further
  - Remixer A: $18 × 70% = $12.60
  - Parent (Original): $18 × 20% = $3.60
  
Step 4: Original Creator gets: $3.60

Final Distribution:
  Platform:      $10.00
  Remixer A1:    $63.00
  Remixer A:     $12.60
  Original:       $3.60
  ─────────────────────
  Total:        $89.20 (+ $0.80 rounding handling)
```

---

## Wallet & Payout

### Wallet Rules
- Mỗi user có **virtual wallet** trên StemVerse
- Wallet lưu accumulated royalty (chưa payout)
- Không có expiry

### Payout Conditions
| Condition | Rule |
|-----------|------|
| Minimum threshold | $50 USD / 1,200,000 VND |
| Frequency | Monthly auto-payout nếu đủ threshold |
| Manual request | User có thể request bất cứ lúc nào (nếu đủ threshold) |

### Payout Methods
| Method | Fee | Time |
|--------|-----|------|
| Stripe (card/bank) | 2.9% + $0.30 | 2–5 days |
| MoMo | 1% | Instant |
| VNPay | 1% | Instant |

---

## Data Flow

```
royalty_events table
     ↓
royalty_transactions table (per party per event)
     ↓
user wallet (sum of credited transactions)
     ↓
payouts table (when threshold met)
     ↓
payment gateway transfer
```

---

## Error Cases

| Error | Handling |
|-------|---------|
| Payment gateway fail | Retry 3x, then mark as pending |
| Creator bank invalid | Email notification, hold funds |
| Split calculation mismatch | Alert admin, freeze payout |
| Fraud detection | Flag for manual review |

---

## Acceptance Criteria

- [ ] Mỗi revenue event tạo đúng số royalty_transactions theo ownership tree
- [ ] Platform fee luôn đúng 10%
- [ ] Nested remix chain chia đúng theo công thức
- [ ] Wallet balance cập nhật real-time sau mỗi event
- [ ] Payout tự động khi threshold đạt (monthly cron job)
- [ ] Email xác nhận khi royalty credited và khi payout success
- [ ] Admin có thể xem toàn bộ royalty flow trong dashboard

---

## Related

- [[SRS-Royalty-Engine]]
- [[Business-Rules]]
- [[SRS-Ownership-Graph]]
- [[API-Royalty]]
- [[Table-Royalty-Transactions]]
- [[Table-Ownership-Relations]]
- [[ADR-008-Stripe-Payment]]
