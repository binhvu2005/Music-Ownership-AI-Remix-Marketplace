# Hướng dẫn Thiết lập Môi trường Chạy thử Cục bộ (Local Environment Setup)

Tài liệu này hướng dẫn cách khởi chạy các dịch vụ phụ trợ (PostgreSQL, Redis, Meilisearch) và cấu hình biến môi trường phục vụ cho phát triển dự án **StemVerse** dưới local.

---

## 📦 1. Các Dịch vụ trong Môi trường Local

Dự án sử dụng **Docker Compose** để chạy các container dịch vụ độc lập:

| Dịch vụ | Phiên bản | Cổng (Host) | Vai trò |
|---------|-----------|-------------|---------|
| **PostgreSQL** | 16-alpine | `5432` | Cơ sở dữ liệu chính lưu trữ User, Song, Stem, Remix, Royalty, License |
| **Redis** | 7-alpine | `6379` | Cache dữ liệu & Hàng đợi (BullMQ) xử lý AI audio pipeline |
| **Meilisearch** | v1.6 | `7700` | Bộ máy tìm kiếm ngữ nghĩa nâng cao cho bài hát & sound assets |

---

## 🚀 2. Cách Khởi chạy Môi trường

### Bước 1: Sao chép các cấu hình môi trường (.env)
Tại thư mục gốc của dự án, sao chép các file mẫu `.env.example` thành `.env` thực tế:

```powershell
# Tại thư mục root dự án
Copy-Item .env.example .env

# Tại thư mục backend
Copy-Item code/backend/.env.example code/backend/.env

# Tại thư mục frontend
Copy-Item code/frontend/.env.example code/frontend/.env
```

*Lưu ý:* Hãy mở các file `.env` vừa tạo để điều chỉnh các khóa bảo mật (JWT_SECRET, OAUTH credentials) hoặc API keys nếu cần.

### Bước 2: Khởi động Docker Compose
Để khởi động toàn bộ các dịch vụ local trong background, chạy lệnh sau ở thư mục root:

```powershell
docker compose up -d
```

Để kiểm tra trạng thái hoạt động của các container:
```powershell
docker compose ps
```

---

## ⚠️ 3. Hướng dẫn Khắc phục Sự cố & Tránh Xung đột (Crucial Gotchas)

Qua kiểm thử thực tế trên hệ thống của bạn, chúng tôi phát hiện một số điểm cần lưu ý:

### Đứt kết nối Docker Engine
**Triệu chứng:** Khi chạy `docker compose up -d`, Docker báo lỗi:
`error during connect: Get ... open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`
* **Nguyên nhân:** Phần mềm **Docker Desktop** trên Windows chưa được khởi động hoặc Service Docker đang bị tắt.
* **Cách khắc phục:** 
  1. Mở phần mềm **Docker Desktop** từ Start Menu Windows.
  2. Đợi cho đến khi biểu tượng Docker ở góc dưới màn hình chuyển sang màu xanh lá cây (Running).
  3. Chạy lại lệnh `docker compose up -d`.

### Xung đột cổng PostgreSQL (Port 5432)
**Triệu chứng:** Cổng `5432` trên máy của bạn hiện đang được sử dụng bởi một dịch vụ PostgreSQL chạy trực tiếp (native service) trên Windows (không qua Docker).
Nếu bạn bật Docker và chạy container Postgres, Docker sẽ báo lỗi xung đột cổng:
`Bind for 0.0.0.0:5432 failed: port is already allocated`.

* **Cách khắc phục (Chọn 1 trong 2 cách):**

  * **Cách A: Dùng trực tiếp PostgreSQL có sẵn trên Windows (Khuyên dùng)**
    1. Không cần chạy container Postgres trong Docker nữa. Bạn chỉ cần vào file `docker-compose.yml` và comment out hoặc xóa service `postgres`.
    2. Chỉ chạy Redis và Meilisearch qua Docker:
       ```yaml
       # docker-compose.yml chỉ giữ lại redis & meilisearch
       ```
    3. Cập nhật `DATABASE_URL` trong file `code/backend/.env` để khớp với thông tin đăng nhập PostgreSQL trên Windows của bạn (User, Password, Tên DB).

  * **Cách B: Tắt PostgreSQL trên Windows để nhường cổng cho Docker**
    1. Mở PowerShell dưới quyền Administrator.
    2. Chạy lệnh dừng service PostgreSQL cục bộ:
       ```powershell
       net stop postgresql-x64-16
       # (Thay 16 bằng phiên bản PostgreSQL thực tế đang cài trên máy bạn)
       ```
    3. Chạy lại `docker compose up -d` để Docker Postgres quản lý cổng 5432.

  * **Cách C: Đổi cổng ánh xạ của Docker Postgres**
    1. Sửa file `docker-compose.yml` phần port của postgres từ `'5432:5432'` thành `'5433:5432'`.
    2. Cập nhật `DATABASE_URL` trong file `code/backend/.env`:
       ```env
       DATABASE_URL="postgresql://postgres:postgres@localhost:5433/stemverse?schema=public"
       ```

---

## 🔍 4. Kiểm tra Kết nối Dịch vụ

Sau khi đã xử lý các xung đột cổng và chạy thành công Docker Compose, bạn có thể kiểm tra xem các dịch vụ có phản hồi kết nối không bằng lệnh PowerShell sau:

```powershell
# Kiểm tra Postgres (5432 hoặc 5433)
Test-NetConnection -ComputerName localhost -Port 5432

# Kiểm tra Redis (6379)
Test-NetConnection -ComputerName localhost -Port 6379

# Kiểm tra Meilisearch (7700)
Test-NetConnection -ComputerName localhost -Port 7700
```
Kết quả `TcpTestSucceeded : True` nghĩa là dịch vụ đã kết nối thành công và sẵn sàng để ứng dụng backend kết nối.
