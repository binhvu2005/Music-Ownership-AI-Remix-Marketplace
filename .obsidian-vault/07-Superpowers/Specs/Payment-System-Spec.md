## Payment System (Stripe) — Specification
**Ngày:** 2026-05-27
**SRS Reference:** [[SRS-Licensing]], [[ADR-008-Stripe-Payment]]
**Actors:** Consumer (Buyer), System Webhook
**Input:** `songId`, `licenseType` từ Frontend.
**Output:** Stripe PaymentIntent `client_secret` trả về Frontend; Webhook ghi nhận `user_licenses` vào Database.
**Business Rules:**
- Giá của từng loại License lấy trực tiếp từ bảng `song_license_configs`, không tin tưởng giá từ Frontend.
- PaymentIntent phải đi kèm metadata: `userId`, `songId`, `licenseType`.
- Khi Webhook `payment_intent.succeeded` được gọi, hệ thống kiểm tra Idempotency Key (dựa trên `pi_xxx`) để tránh cộng dồn/tạo license 2 lần.
- License Key được sinh ra theo định dạng `STMV-{SONG_SHORT}-{TYPE}-{RANDOM}`.
**Edge Cases:**
- Tiền thanh toán không khớp với DB (do Creator mới đổi giá) -> Cứ chấp nhận vì lúc user checkout là giá cũ.
- Trùng `payment_intent_id` trên Webhook -> Bỏ qua.
- Exclusive License được mua -> Khóa `exclusive_enabled = false` cho bài hát đó.
**Acceptance Criteria:**
- [ ] AC1: Tạo thành công Stripe PaymentIntent với giá đúng từ DB.
- [ ] AC2: Webhook Endpoint verify thành công Stripe Signature.
- [ ] AC3: Xử lý `payment_intent.succeeded` để INSERT vào bảng `user_licenses`.
- [ ] AC4: Khóa license exclusive sau khi thanh toán thành công.
