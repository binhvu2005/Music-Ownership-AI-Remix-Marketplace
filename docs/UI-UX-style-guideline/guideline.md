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
