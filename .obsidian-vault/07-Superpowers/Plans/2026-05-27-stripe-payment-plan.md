# Stripe Payment Integration Plan

**Ngày:** 2026-05-27
**Tham chiếu:** [[Payment-System-Spec]], [[ADR-008-Stripe-Payment]]

## Backend (NestJS)

- `[NEW] src/payment/stripe.module.ts`: Khởi tạo Stripe globally bằng `@nestjs/config`.
- `[NEW] src/payment/payment.controller.ts`:
  - `POST /payment/create-intent`: Nhận `songId`, `licenseType` -> Gọi Stripe API tạo PaymentIntent -> Trả về `clientSecret`.
  - `POST /payment/webhook`: Nhận webhook từ Stripe, xác thực signature.
- `[NEW] src/payment/payment.service.ts`:
  - Xử lý logic tạo Intent.
  - Xử lý `payment_intent.succeeded`: Đọc metadata (songId, licenseType, userId), sau đó INSERT vào `user_licenses` bằng transaction an toàn.

## Frontend (Next.js)

- `[MODIFY] src/lib/payment.ts`: Khởi tạo `@stripe/stripe-js` với Publishable Key.
- `[NEW] src/components/payment/CheckoutForm.tsx`: UI Component Stripe Elements. Gọi hàm `stripe.confirmPayment()`.
- `[NEW] src/app/(public)/checkout/[songId]/page.tsx`: Route mua License. Bọc `CheckoutForm` trong `<Elements>`.

## TDD Plan
- Bắt buộc viết test case RED cho `payment.service.spec.ts` (Mock gọi Stripe API).
- Đảm bảo Coverage 100% cho module này trước khi chạy thật.
