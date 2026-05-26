# Hướng dẫn Kỹ thuật: Khởi tạo Cơ sở dữ liệu, Migrations & Seeding

Tài liệu này ghi nhận lại cấu trúc thiết lập, cơ chế hoạt động và cách chạy Migrations cùng dữ liệu mẫu (Seeding) trong cơ sở dữ liệu của dự án **StemVerse**.

---

## 🗄 1. Tổng quan cấu trúc bảng dữ liệu (Prisma Schema)

Cơ sở dữ liệu được thiết kế gồm 14 bảng quan trọng phục vụ đầy đủ vòng đời âm nhạc kỹ thuật số:
1. `users`: Thông tin người dùng (phân vai trò: Creator, Remixer, Consumer, Admin).
2. `oauth_accounts`: Lưu trữ tokens liên kết đăng nhập OAuth (Google, Spotify, Discord).
3. `songs`: Lưu trữ bài hát gốc hoặc bài hát remix phái sinh.
4. `stems`: Tách nhỏ các track âm thanh của bài hát (Vocals, Drums, Bass, Melody).
5. `song_analysis`: Kết quả phân tích âm thanh (BPM, Key, Mood và mảng float biểu diễn Waveform).
6. `song_license_configs`: Cấu hình giá bán cho 4 loại bản quyền (Personal, Commercial, Remix, Exclusive).
7. `ownership_relations`: Sơ đồ phả hệ sở hữu (immutable) theo dõi bài hát cha-con và tỷ lệ chia % doanh thu.
8. `user_licenses`: Lịch sử các license bản quyền người dùng đã mua.
9. `royalty_transactions`: Nhật ký chia doanh thu tự động khi có lượt stream hoặc bán license.
10. `user_wallets`: Số dư tài khoản khả dụng và tổng doanh thu tích lũy của từng user.
11. `payouts`: Lịch sử yêu cầu rút tiền về Stripe, MoMo hoặc VNPay.
12. `follows`: Mối quan hệ theo dõi giữa các nghệ sĩ.
13. `likes` & `comments`: Các tương tác mạng xã hội xung quanh bài phối nhạc.

---

## ⚙️ 2. Hướng dẫn Chạy Migrations & Seeding cục bộ

### Cấu hình cổng kết nối hoạt động
Do phần mềm Docker Desktop trên máy của bạn hiện đang tắt và hệ thống đang chạy sẵn một service PostgreSQL cục bộ trên cổng mặc định `5432`, chúng tôi đã cấu hình file `.env` thực tế kết nối trực tiếp vào service PostgreSQL bản địa này:
* **Chuỗi kết nối (DATABASE_URL):** `postgresql://postgres:postgres@localhost:5432/stemverse?schema=public`

### Các câu lệnh thực thi (Chạy tại code/backend)

1. **Chạy migrations tạo bảng:**
   Lệnh này sẽ tự động tạo cơ sở dữ liệu `stemverse` nếu chưa có trên PostgreSQL native của bạn, sau đó đồng bộ hóa toàn bộ cấu trúc bảng từ `schema.prisma`:
   ```powershell
   npx prisma migrate dev --name init --schema=prisma/schema.prisma
   ```

2. **Chạy Seeding nạp dữ liệu mẫu:**
   Nạp dữ liệu mẫu khởi tạo tài khoản, ví, cấu hình bài hát gốc mẫu "Summer Breeze":
   ```powershell
   npx prisma db seed --schema=prisma/schema.prisma
   ```

---

## 📊 3. Dữ liệu mẫu đã được nạp (Seeded Data)

Dữ liệu mẫu sau khi seed thành công bao gồm:
* **Tài khoản người dùng & Ví:**
  * **Original Creator:** `creator@stemverse.com` (Đã xác minh, Ví có sẵn: `$150.00`, Tổng kiếm được: `$250.00`).
  * **AI Remixer:** `remixer@stemverse.com` (Đã xác minh, Ví có sẵn: `$50.00`, Tổng kiếm được: `$50.00`).
  * **Music Fan:** `fan@stemverse.com` (Tài khoản người dùng thông thường).
* **Bài hát gốc mẫu ("Summer Breeze"):**
  * Tác giả: Original Creator.
  * Thể loại: Synthwave, 110 BPM, tông Am (A Minor).
  * Trạng thái xử lý: `done` (đã tách stem thành công).
  * Có sẵn 4 stems phụ: Vocals, Drums, Bass, Melody.
  * Cấu hình chia tiền: Remixer nhận **20%**, Tác giả nhận **70%**, Nền tảng thu **10%**.
  * Cấu hình bảng giá bản quyền:
    * Cá nhân (Personal): `$0.99`
    * Thương mại (Commercial): `$29.99`
    * Phối nhạc (Remix): `$4.99`
    * Độc quyền (Exclusive): `$199.99`
