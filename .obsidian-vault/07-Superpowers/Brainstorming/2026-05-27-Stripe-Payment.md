## Stripe Payment Integration — Brainstorming
**Ngày:** 2026-05-27
**Vấn đề:** 
Hệ thống StemVerse cần một cơ chế thanh toán quốc tế ổn định (thông qua Stripe) để Consumer có thể mua License (Commercial, Remix, Exclusive). Sau khi thanh toán thành công, hệ thống phải ghi nhận bản quyền (user_licenses) và chuẩn bị chia tiền bản quyền (Royalty).

**Ý tưởng:**
1. Frontend gọi trực tiếp Stripe API để tạo Payment Intent, sau đó push kết quả lên Backend để verify. (Nguy cơ bảo mật)
2. Backend tạo Payment Intent, trả `client_secret` cho Frontend. Frontend dùng Stripe Elements để thanh toán. Stripe gửi Webhook về Backend báo thành công. (Bảo mật cao, chuẩn luồng Stripe).

**Quyết định:** 
Chọn ý tưởng 2 (Chuẩn luồng Stripe). Webhook là nguồn sự thật (source of truth) duy nhất để tạo License.
- Dùng `stripe.paymentIntents.create` ở Backend.
- Sử dụng `idempotency_key` để tránh xử lý Webhook 2 lần.

**Next:** Viết spec → [[Payment-System-Spec]]
