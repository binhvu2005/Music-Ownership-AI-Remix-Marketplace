# Backlog Sprint 2 — Upload Nhạc & AI Audio Analysis (2 Tuần)

## Mục tiêu Sprint
Xây dựng chức năng upload nhạc gốc (Full Track + Stems), lưu trữ lên Cloudflare R2 và kích hoạt dịch vụ AI Audio Service (FastAPI) để tự động phân tích BPM, Key và sinh Waveform cho bài hát.

## Danh sách Nhiệm vụ (Tasks)

### 1. Cấu hình Lưu trữ Cloudflare R2
- **Mô tả**: Thiết lập bucket lưu trữ cho các file âm thanh chất lượng cao.
- **Chi tiết**:
  - Tạo bucket trên Cloudflare R2.
  - Cấu hình Cors policy cho phép tải nhạc trực tiếp từ client.
  - Thiết lập API sinh Presigned URL trên backend để upload bảo mật.

### 2. Xây dựng Music Service API (Backend)
- **Mô tả**: Phát triển các API phục vụ quản lý bài hát gốc.
- **Chi tiết**:
  - API lấy Presigned URL upload file audio lên R2.
  - API thêm mới bài hát (lưu link R2, Title, Genre, Key, BPM, Owner).
  - API sửa, xóa và truy vấn thông tin bài hát.

### 3. Thiết lập AI Service (Python/FastAPI)
- **Mô tả**: Tạo dựng service xử lý âm thanh sử dụng Python.
- **Chi tiết**:
  - Khởi tạo khung dự án FastAPI với Python 3.10+.
  - Thiết lập các thư viện: `librosa` (xử lý âm thanh), `soundfile`, `pydantic`.
  - API nhận file nhạc đầu vào và trả về BPM & Key đã phát hiện.

### 4. Tự động Tạo Waveform & Phân tích Audio
- **Mô tả**: Sinh dữ liệu biểu đồ dạng sóng và thông tin nhạc lý.
- **Chi tiết**:
  - Sử dụng FFmpeg trên AI Service để sinh file waveform JSON hoặc hình ảnh.
  - Viết thuật toán phát hiện tempo/nhịp độ (BPM) và giọng (Key) của bài hát.

### 5. Xây dựng Giao diện Upload (Frontend)
- **Mô tả**: Tạo trang upload nhạc cho Creator.
- **Chi tiết**:
  - Giao diện kéo thả file nhạc (.wav, .mp3).
  - Thanh hiển thị tiến trình upload (Progress bar).
  - Form nhập thông tin bài hát (Title, Key, BPM, Genre, Bản quyền).
