# StemVerse — Hướng dẫn Phong cách Thiết kế (UI/UX Style Guideline)

Tài liệu này định nghĩa hệ thống thiết kế (Design System) của StemVerse. Toàn bộ giao diện người dùng phải tuân thủ hướng dẫn này để đảm bảo trải nghiệm đồng nhất, cao cấp và hiện đại.

---

## 🎨 Bảng màu (Color Palette)

Dự án sử dụng chủ đề **Dark Mode** làm giao diện mặc định nhằm tạo cảm giác hiện đại, chuyên nghiệp giống Spotify và GitHub.

| Loại màu | Mã màu (HEX) | Sử dụng |
|----------|--------------|---------|
| **Background (Chính)** | `#0B0F19` | Nền chính của toàn bộ trang web (Dark Slate Blue) |
| **Surface (Phụ)** | `#1F2937` | Nền của các thẻ (Cards), Sidebars, Modals (Gray 800) |
| **Primary (Nổi bật)** | `#8B5CF6` | Màu tím ánh neon làm điểm nhấn, nút chính, liên kết (Violet 500) |
| **Secondary** | `#10B981` | Màu xanh lá dùng cho nút Play, thành công, phần trăm royalty (Emerald 500) |
| **Text Primary** | `#F9FAFB` | Chữ chính có độ tương phản cao (Gray 50) |
| **Text Secondary** | `#9CA3AF` | Chữ phụ, chú thích, metadata (Gray 400) |
| **Warning/Danger** | `#EF4444` | Màu đỏ hiển thị lỗi, cảnh báo bản quyền (Red 500) |

---

## ✍️ Kiểu chữ (Typography)

- **Font chữ chính (Primary Font)**: Sử dụng font **Outfit** hoặc **Inter** từ Google Fonts.
- **Font chữ lập trình (Monospace Font)**: Sử dụng **JetBrains Mono** hoặc **Fira Code** cho các đoạn code hoặc metadata nhạc lý (BPM, Key).

### Cấu trúc tiêu đề (Headings)

```css
h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.25rem (36px);
  font-weight: 700;
  color: #F9FAFB;
}

h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem (24px);
  font-weight: 600;
  color: #F9FAFB;
}

body {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem (14px) hoặc 1rem (16px);
  color: #9CA3AF;
  line-height: 1.5;
}
```

---

## ⚡ Các thành phần giao diện cơ bản (Base Components)

### 1. Nút bấm (Buttons)
- **Primary Button**: Nền màu Primary (`#8B5CF6`), chữ trắng. Bo góc `rounded-xl` (12px), có hiệu ứng hover mượt mà và bóng mờ nhẹ (`shadow-indigo-500/20`).
- **Secondary Button**: Nút viền (Outline) hoặc nền Gray 800 (`#1F2937`), chữ xám nhạt (`#E5E7EB`).
- **Play Button**: Tròn, nền Emerald 500 (`#10B981`), icon Play màu tối, phóng to nhẹ khi hover.

### 2. Thẻ hiển thị bài hát (Track Cards)
- Sử dụng hiệu ứng **Glassmorphism** nhẹ: `bg-gray-900/60 backdrop-blur-md border border-gray-800`.
- Hiển thị ảnh bìa album bo góc `rounded-lg`, hover sẽ hiện icon Play mờ đè lên ảnh bìa.
- Các thông số nhạc lý (BPM, Key) hiển thị ở góc dưới thẻ dạng thẻ nhỏ (Badge) bo tròn gọn gàng.

### 3. Biểu đồ sóng âm (Waveform Player)
- Dạng sóng gốc hiển thị màu tím nhạt (`#A78BFA` với opacity thấp).
- Dạng sóng đã phát (Progress) hiển thị màu tím đậm sáng rực (`#8B5CF6`).
- Hiển thị timeline chạy song song mượt mà theo giây.

---

## 📱 Khả năng tương thích thiết bị (Responsive Rules)

- **Mobile (dưới 640px)**: Ẩn sidebar phụ, chuyển sang thanh điều hướng dưới đáy (Bottom Navigation). Danh sách bài hát rút gọn hiển thị dọc.
- **Tablet (640px - 1024px)**: Sidebar thu gọn thành các icon, hiển thị lưới bài hát 2 cột.
- **Desktop (trên 1024px)**: Hiển thị sidebar đầy đủ, lưới bài hát 4 hoặc 5 cột.

---

## 🌗 Chế độ Sáng/Tối (Light/Dark Mode Theme)

Giao diện StemVerse phải được thiết kế để tự động thay đổi dựa trên tùy chọn hệ thống hoặc do người dùng thủ công chọn qua nút bấm đổi theme (Theme Switcher).

### Bảng đối chiếu màu sắc (Color Tokens Mapping)

| CSS Variable | Light Theme | Dark Theme (Stitch Default) | Sử dụng |
|--------------|-------------|-----------------------------|---------|
| `--background` | `#F9FAFB` (Gray 50) | `#15121b` (Deep Slate Black) | Nền chính của ứng dụng |
| `--foreground` | `#111827` (Gray 900) | `#E7E0ED` (White-purple tint) | Chữ chính trên nền ứng dụng |
| `--surface` | `#FFFFFF` (White) | `#1F2937` (Gray 800 / Slate Surface) | Nền của các thẻ (Cards), Sidebars, Modals |
| `--surface-border`| `#E5E7EB` (Gray 200) | `#2D3748` (Gray 700 / Slate Border) | Đường viền ngăn cách nhẹ |
| `--primary` | `#6D3BD7` (Deep Purple) | `#D0BCFF` (Neon Purple / Violet 500) | Nút bấm chính, màu nhấn thương hiệu |
| `--secondary` | `#00A572` (Green) | `#4EDEA3` (Emerald Green) | Trạng thái phát nhạc (Play), Xếp hạng, Royalty split |
| `--text-primary` | `#111827` (Gray 900) | `#E7E0ED` | Chữ chính trong card, danh sách |
| `--text-secondary`| `#4B5563` (Gray 600) | `#CBC3D7` (Slate Gray) | Chữ phụ, chú thích, metadata (BPM, Key) |

### Cách áp dụng trong code:
* Sử dụng CSS variables ở `globals.css` để định nghĩa:
  ```css
  :root {
    --background: #f9fafb;
    /* ... các giá trị sáng */
  }
  .dark {
    --background: #15121b;
    /* ... các giá trị tối */
  }
  ```
* Trong JSX/TSX component: Sử dụng các lớp CSS chung như `bg-background text-foreground border-surface-border` để giao diện tự động thích ứng khi class `.dark` được toggled.

---

## 🌐 Đa ngôn ngữ (i18n Localization Guidelines)

StemVerse hướng tới người dùng toàn cầu (Creator quốc tế và Creator Việt Nam), vì vậy giao diện bắt buộc phải hỗ trợ cả hai ngôn ngữ: **Tiếng Việt (VI)** và **Tiếng Anh (EN)**.

* **Từ điển ngôn ngữ:** Lưu trữ tại `code/frontend/src/locales/vi.json` và `en.json`.
* **Trạng thái ngôn ngữ:** Một biến Context/State lưu trữ ngôn ngữ hiện tại (`vi` hoặc `en`).
* **Quy tắc đặt từ khóa (Translation Keys):** Đặt theo phân cấp module rõ ràng:
  * `common`: Các từ khóa chung như `save`, `cancel`, `loading`, `error`.
  * `nav`: Các mục điều hướng trong sidebar (`home`, `explore`, `studio`, `wallet`, ...).
  * `auth`: Đăng nhập, đăng ký (`login`, `register`, `forgot_password`).
  * `upload`: Các nhãn của trang upload stems và cài đặt bản quyền.
  * `studio`: Các điều khiển và preset của AI Remix.
  * `wallet`: Thống kê doanh thu, tiền bản quyền và cấu hình rút tiền.
  * `disputes`: Các trạng thái khiếu nại bản quyền.
  * `pricing`: Các gói đăng ký dịch vụ.
