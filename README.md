# 🎵 StemVerse

![StemVerse Logo](docs/assets/logo.jpg)

> **"GitHub + Spotify + AI Remix Engine cho âm nhạc"**  
> Nền tảng Quản lý Sở hữu Âm nhạc & Chợ Remix Tích hợp Trí tuệ Nhân tạo.

---

## 🚀 Giới thiệu về StemVerse
StemVerse giải quyết các vấn đề bản quyền và phân chia doanh thu trong văn hóa nhạc remix bằng giải pháp **Sơ đồ quan hệ sở hữu dạng đồ thị (GitHub-style Ownership Graph)**. Nền tảng cho phép:
- 🎵 **Upload** bài nhạc gốc (Full Track + các Stems riêng lẻ như vocal, drums, bass, melody).
- 🤖 **AI Remix** — Chuyển đổi thể loại, tempo, pitch của nhạc bằng Text Prompt thông qua AI.
- 📊 **Ownership Graph** — Tự động thiết lập đồ thị kế thừa khi có bản remix phái sinh.
- 💰 **Auto Royalty** — Tự động phân chia doanh thu trực tiếp cho các nút sở hữu (Creator 70%, Remixer 20%, Platform 10%).
- 🏪 **Marketplace** — Mua bán bản quyền thương mại hoặc phi thương mại cho các bài hát gốc/stems.

---

## 📁 Cấu trúc Thư mục Monorepo

```
Music-Ownership+AI-Remix-Marketplace/
├── docs/                           # Tài liệu dự án tập trung
│   ├── srs.md                      # Đặc tả yêu cầu phần mềm (Hợp nhất)
│   ├── convention.md               # Quy tắc code chuẩn (Coding Conventions)
│   ├── backlogs/                   # Quản lý backlog và nhiệm vụ theo Sprint
│   ├── DB-erd/                     # Thiết kế Database, thực thể & quan hệ
│   └── UI-UX-style-guideline/      # Hướng dẫn thiết kế giao diện (Design System)
│
├── code/                           # Mã nguồn dự án
│   ├── frontend/                   # Ứng dụng Next.js 15 (App Router, TS, Tailwind)
│   └── backend/                    # Ứng dụng NestJS + Prisma ORM
│
├── .agent/                         # Cấu hình AI Coding Agent (Superpowers)
│   ├── rules/                      # Luật code, ngữ cảnh dự án cho AI
│   ├── workflows/                  # Quy trình phát triển (Feature, Bug, Refactor)
│   └── skills/                     # 14 kỹ năng tự động của coding agent
│
├── test/                           # Kiểm thử tích hợp hệ thống
│   └── test-plan.md
│
├── .cursorrules                    # File chỉ dẫn bắt buộc cho AI Assistant
├── .gitignore                      # File cấu hình bỏ qua git của monorepo
└── README.md                       # Tài liệu tổng quan dự án (File này)
```

---

## ⚙️ Hướng dẫn Khởi chạy (Quick Start)

### 1. Khởi động môi trường Database & Services phụ trợ
Dự án sử dụng Docker để chạy PostgreSQL, Redis và Meilisearch:
```bash
docker compose up -d
```

### 2. Chạy Backend (NestJS API)
```bash
cd code/backend
npm install
npx prisma db push
npx prisma db seed # Nạp dữ liệu mẫu
npm run start:dev
```
Dịch vụ backend sẽ chạy tại cổng mặc định `http://localhost:3001` (hoặc cổng được định nghĩa trong `.env`).

### 3. Chạy Frontend (Next.js 15)
```bash
cd code/frontend
npm install
npm run dev
```
Dịch vụ frontend sẽ chạy tại `http://localhost:3000`.

---

## ⚔️ 3 Điều Luật Sắt (Iron Laws) cho Nhà Phát Triển / AI Agent
Mọi thành viên tham gia code dự án bắt buộc phải tuân thủ:
1. **KHÔNG CÓ SPEC → KHÔNG CÓ CODE**: Tuyệt đối không viết code logic nếu chưa có file thiết kế/đặc tả được mô tả trong [srs.md](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/docs/srs.md).
2. **KHÔNG CÓ TEST LỖI → KHÔNG CÓ CODE PRODUCTION**: Sử dụng phương pháp phát triển hướng kiểm thử (TDD). Viết test lỗi trước, viết code sau.
3. **BẰNG CHỨNG TRƯỚC - BÁO CÁO SAU**: Mọi báo cáo hoàn thành tính năng phải đính kèm nhật ký chạy test suite thành công 100%.

---

## 👥 Solo Developer
Dự án được xây dựng bởi **Solo Developer** kết hợp với **AI Coding Agent** tuân thủ quy trình phát triển kỷ luật của Superpowers framework.
