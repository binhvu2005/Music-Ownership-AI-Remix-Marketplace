# Backlog Sprint 1 — Thiết lập Nền tảng & Auth (2 Tuần)

## Mục tiêu Sprint
Thiết lập toàn bộ khung làm việc Monorepo cho dự án StemVerse bao gồm Frontend (Next.js), Backend (NestJS), cấu hình Docker cho cơ sở dữ liệu và triển khai hệ thống Xác thực (Authentication).

## Danh sách Nhiệm vụ (Tasks)

### 1. Cấu trúc Monorepo & Khởi tạo Codebase
- **Mô tả**: Tạo thư mục `code/` và khởi tạo mã nguồn dự án.
- **Chi tiết**:
  - Khởi tạo Next.js App Router tại `code/frontend/`.
  - Khởi tạo NestJS tại `code/backend/`.
  - Thiết lập Git chung và file `.gitignore` bỏ qua các thư mục build.

### 2. Thiết lập Docker Compose & Môi trường chạy thử
- **Mô tả**: Dựng môi trường chạy thử cục bộ cho các dịch vụ phụ trợ.
- **Chi tiết**:
  - Tạo file `docker-compose.yml` định nghĩa các container:
    - **PostgreSQL 16**: Cơ sở dữ liệu chính.
    - **Redis**: Dùng làm Cache và hàng đợi BullMQ.
    - **Meilisearch**: Phục vụ tìm kiếm bài hát nâng cao.
  - Viết file `.env.example` khai báo các biến môi trường kết nối.

### 3. Thiết lập Schema Database với Prisma ORM
- **Mô tả**: Cấu hình các bảng dữ liệu cốt lõi của StemVerse trên database.
- **Chi tiết**:
  - Khởi tạo Prisma trong `code/backend/`.
  - Định nghĩa các bảng chính: `users`, `songs`, `stems`, `remixes`, `ownership_relations`, `licenses`, `royalty_transactions`.
  - Chạy migrate để sync schema với database PostgreSQL trong Docker.

### 4. Xây dựng Authentication Service (Backend)
- **Mô tả**: Viết API đăng ký, đăng nhập và xác thực token JWT.
- **Chi tiết**:
  - Đăng ký tài khoản bằng Email/Mật khẩu.
  - Đăng nhập trả về Access Token & Refresh Token (JWT).
  - Tích hợp Google OAuth/Spotify OAuth phục vụ đăng nhập nhanh.

### 5. Thiết lập Giao diện Frontend Cơ bản
- **Mô tả**: Thiết lập khung giao diện Next.js cho người dùng.
- **Chi tiết**:
  - Dựng Layout chính (Header, Footer, Sidebar).
  - Viết trang Đăng nhập (Login) và Đăng ký (Register) kết nối với API backend.
