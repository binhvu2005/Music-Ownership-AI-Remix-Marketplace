---
title: Flow — Buy License
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - flow
  - license
  - consumer
  - payment
---

# Flow — Buy License (Consumer)

## Mục tiêu

Cho phép Consumer mua license để sử dụng âm nhạc cho mục đích thương mại hoặc cá nhân.

---

## User Flow

```
[Consumer] Tìm kiếm / Browse tracks
     ↓
[Consumer] Mở Track Detail Page
     ↓
[Consumer] Xem thông tin license available:
     ├── Personal License: Free / $X
     ├── Commercial License: $X
     ├── Remix License: $X
     └── Exclusive License: Contact / $X
     ↓
[Consumer] Click "Get License" → Chọn loại
     ↓
[System] Check: user đã đăng nhập?
     ├── NO → Redirect Login → Back to track
     └── YES → Tiếp tục
     ↓
[System] Check: user đã có license cho bài này chưa?
     ├── YES → "You already have [License Type] for this track"
     └── NO → Tiếp tục
     ↓
     === Nếu Personal License miễn phí ===
     ↓
[System] Tạo license record ngay
[System] Gửi email xác nhận + license key
[Consumer] Redirect về My Licenses
     ↓
     === Nếu có phí ===
     ↓
[Consumer] Xem Order Summary:
     ├── Track name
     ├── License type
     ├── Price
     └── What's included
     ↓
[Consumer] Click "Proceed to Payment"
     ↓
[Consumer] Chọn phương thức thanh toán:
     ├── Credit/Debit Card (Stripe)
     ├── MoMo (Vietnam)
     └── VNPay (Vietnam)
     ↓
[Consumer] Complete payment
     ↓
[Payment Gateway] Callback success
     ↓
[System] Tạo license record
[System] Trigger royalty distribution event
[System] Gửi email: license key + download links
[System] Notify Creator: "Your track was licensed!"
     ↓
[Consumer] Redirect: "License Purchased Successfully"
[Consumer] Có thể download stems/track theo license type
```

---

## License Entitlements

| License | Stream | Download | Commercial | Remix | Exclusive |
|---------|--------|---------|-----------|-------|---------|
| Personal | ✅ | ✅ | ❌ | ❌ | ❌ |
| Commercial | ✅ | ✅ | ✅ | ❌ | ❌ |
| Remix | ✅ | ✅ | ❌ | ✅ | ❌ |
| Exclusive | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Payment Methods

| Method | Provider | Region |
|--------|---------|--------|
| Credit/Debit Card | Stripe | Global |
| MoMo | MoMo API | Vietnam |
| VNPay | VNPay API | Vietnam |

---

## Royalty Trigger

Khi payment success:
1. **Platform fee** tính ngay (5–15%)
2. **Creator royalty** được credit vào creator wallet
3. **Royalty transaction** record được tạo
4. Creator có thể withdraw khi đạt threshold ($50 / 1,200,000 VND)

---

## Error Cases

| Error | Handling |
|-------|---------|
| Payment failed | Show error, không tạo license |
| Duplicate purchase | Block với thông báo |
| Exclusive already sold | "This exclusive license is no longer available" |
| Payment timeout | Cancel order, refund nếu charged |

---

## Acceptance Criteria

- [ ] Hiển thị đúng các loại license có sẵn cho mỗi track
- [ ] Personal license miễn phí không cần payment flow
- [ ] Payment flow hoạt động với Stripe sandbox
- [ ] License record tạo ngay sau payment success webhook
- [ ] Royalty distribution trigger đúng sau purchase
- [ ] Email confirmation gửi trong 1 phút
- [ ] Creator notification gửi khi có người mua

---

## Related

- [[SRS-Licensing]]
- [[SRS-Royalty-Engine]]
- [[API-Licensing]]
- [[API-Royalty]]
- [[Table-Licenses]]
- [[Table-Royalty-Transactions]]
- [[ADR-008-Stripe-Payment]]
