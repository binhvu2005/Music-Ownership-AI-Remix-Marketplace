# Kế hoạch Kiểm thử — StemVerse Test Plan

Tài liệu này định nghĩa chiến lược kiểm thử toàn bộ dự án StemVerse bao gồm Frontend (Next.js), Backend (NestJS) và tích hợp các thuật toán xử lý âm thanh AI.

---

## 🧪 Chiến lược Kiểm thử (Testing Strategy)

Chúng ta tuân thủ nghiêm ngặt nguyên lý **Test-Driven Development (TDD)** theo quy trình:
1. Viết Test lỗi trước (RED).
2. Viết Code tối thiểu để Test qua (GREEN).
3. Tối ưu hóa & Làm sạch code (REFACTOR).

---

## 🛠 Bộ công cụ kiểm thử (Test Stack)

- **Backend (NestJS)**: Jest làm Test Runner và Mocking library.
- **Frontend (Next.js)**: Jest kết hợp với React Testing Library cho unit test component, và Playwright cho End-to-End (E2E) testing.
- **AI Service (FastAPI)**: PyTest để kiểm thử các hàm xử lý âm thanh (BPM, Key detection).

---

## 📋 Các đầu mục kiểm thử chính

### 1. Unit Tests (Kiểm thử đơn vị)
- **Mã nguồn**: Đặt cạnh file logic (ví dụ: `songs.service.spec.ts`).
- **Nghiệp vụ quan trọng cần test**:
  - Thuật toán tính toán Royalty Split (đảm bảo chia đúng tỷ lệ 70/20/10 và không có sai số float).
  - Logic xác thực chữ ký số & phân quyền cho việc truy cập file âm thanh trên R2.

### 2. Integration Tests (Kiểm thử tích hợp)
- **Thư mục**: `test/` hoặc `code/backend/test/` (NestJS e2e testing).
- **Luồng tích hợp cần test**:
  - Đăng ký → Đăng nhập → Lấy Token → Xác thực endpoint bảo mật.
  - Upload nhạc → Kích hoạt hàng đợi BullMQ → Gọi AI service analyze → Trả về kết quả phân tích.

### 3. End-to-End (E2E) Tests
- **Công cụ**: Playwright.
- **Nghiệm vụ cần giả lập**:
  - Creator upload nhạc và điền metadata thành công.
  - Remixer chọn bài hát gốc, viết prompt và nhấn nút AI Remix, nhận về bài hát mới.
  - Fan mua License qua Stripe và nhận file download có chứa DRM/Watermark.
