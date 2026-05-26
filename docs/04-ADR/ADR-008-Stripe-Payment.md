---
title: ADR-008 — Use Stripe as Primary Payment Gateway
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, payment, stripe]
---

# ADR-008 — Use Stripe as Primary Payment Gateway

## Status: Accepted ✅

## Context

StemVerse cần xử lý payments cho license purchases và royalty payouts. Cần hỗ trợ:
- International (credit card)
- Vietnam local (MoMo, VNPay)

## Decision

**Primary**: Stripe (global)
**Secondary**: MoMo + VNPay (Vietnam users)

## Reasons (Stripe)

| Reason | Detail |
|--------|-------|
| Developer experience | Best-in-class SDK |
| Webhook reliability | Reliable delivery + retry |
| Idempotency | Built-in idempotency keys |
| Payout support | Direct bank transfer |
| Dispute management | Dashboard + API |
| PCI compliance | Stripe handles all card data |

## Payment Flow (Stripe)

```
1. Frontend: stripe.confirmPayment() → get payment_intent_id
2. Backend: Verify payment_intent với Stripe API
3. Backend: Receive webhook: payment_intent.succeeded
4. Backend: Create license record
5. Backend: Trigger royalty distribution
```

## Royalty Payout (Stripe Connect)

```
Creator onboards → Stripe Connect account
Platform collects payment → Stripe
Platform distributes → Stripe Connect transfer to creator
Creator withdraws → Bank account
```

## Vietnam Payment Strategy (Phase 2)

| Gateway | Integration | Fee |
|---------|-----------|-----|
| MoMo | MoMo Business API | 1.1% |
| VNPay | VNPay QR SDK | 1.2% |

## Pricing

| Stripe | Fee |
|--------|-----|
| Card processing | 2.9% + $0.30 |
| International | +1.5% |
| Payout (Connect) | 0.25% |

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| PayPal | Poor DX, high fees |
| Braintree | Less features than Stripe |
| Adyen | Enterprise-only pricing |

## Consequences

- ✅ Battle-tested, reliable
- ✅ Excellent webhook handling
- ✅ Connect = clean payout solution
- ⚠️ Stripe không phổ biến ở Vietnam → cần MoMo/VNPay
- ⚠️ Stripe Connect onboarding phức tạp cho creators

## Related

- [[SRS-Royalty-Engine]]
- [[SRS-Licensing]]
- [[Flow-Buy-License]]
- [[Flow-Royalty-Split]]
