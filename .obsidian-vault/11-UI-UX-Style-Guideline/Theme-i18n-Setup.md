# Hướng dẫn Kỹ thuật: Cấu hình Giao diện linh hoạt (Sáng/Tối) & Đa ngôn ngữ (i18n)

Tài liệu này ghi nhận lại cấu trúc thiết lập và cách sử dụng tính năng chuyển đổi Giao diện (Theme) và Đa ngôn ngữ (i18n) trong frontend của **StemVerse** (Next.js 15).

---

## 🌗 1. Chế độ Sáng/Tối (Theme Switching)

### Cú pháp và CSS Variables
Toàn bộ mã màu của dự án được quản lý qua CSS variables trong file [globals.css](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/app/globals.css).

* **Giao diện Sáng (Light Theme):** Được thiết lập mặc định trong selector `:root`.
* **Giao diện Tối (Dark Theme):** Được kích hoạt khi thẻ `html` hoặc `body` có class `.dark`.

Các biến màu cơ bản:
* `--background`: Nền chính (`#f9fafb` / `#15121b`).
* `--foreground`: Màu chữ chính (`#111827` / `#e7e0ed`).
* `--surface`: Nền của các hộp, thẻ (`#ffffff` / `#1f2937`).
* `--surface-border`: Đường viền phân cách (`#e5e7eb` / `#2d3748`).
* `--primary`: Tím chủ đạo (`#6d3bd7` / `#d0bcff`).
* `--secondary`: Xanh lá điểm nhấn (`#00a572` / `#4edea3`).

### Cơ chế hoạt động (React Context)
Được quản lý thông qua [ThemeContext.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/context/ThemeContext.tsx):
1. **Khởi tạo:** Kiểm tra lựa chọn cũ của người dùng trong `localStorage`. Nếu không có, tự động lấy cấu hình mặc định từ hệ điều hành thông qua `window.matchMedia('(prefers-color-scheme: dark)')`.
2. **Kích hoạt:** Thêm hoặc xóa class `.dark` ở thẻ `html` để Tailwind v4 tự động ánh xạ lại các token `@theme`.
3. **Mã nguồn mẫu:**
   ```typescript
   const { theme, toggleTheme } = useTheme();
   // Gọi toggleTheme() để thay đổi giữa sáng và tối
   ```

---

## 🌐 2. Hệ thống Đa ngôn ngữ (i18n)

### Từ điển dịch thuật
Các file từ điển dịch thuật dạng JSON được đặt tại:
* [en.json](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/locales/en.json) (Tiếng Anh)
* [vi.json](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/locales/vi.json) (Tiếng Việt)

### Hàm dịch động (Nested Key Lookup)
Được quản lý thông qua [LanguageContext.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/context/LanguageContext.tsx). Hàm `t(path)` hỗ trợ phân tích đường dẫn dấu chấm (dot notation) để truy xuất dữ liệu lồng nhau:

```typescript
// Ví dụ sử dụng trong Component:
const { t } = useLanguage();

return (
  <h1>{t('auth.login.title')}</h1> // Chuyển thành "Welcome back" hoặc "Chào mừng quay lại"
);
```

Nếu một khóa dịch không tồn tại, hàm `t()` sẽ trả về chính đường dẫn khóa đó làm phương án dự phòng (fallback) thay vì trả về chuỗi rỗng.

---

## ⚙️ 3. Tích hợp và Sử dụng

### Tích hợp Layout gốc
Cả hai Context Provider được bọc xung quanh ứng dụng ở file [layout.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/app/layout.tsx):

```tsx
<LanguageProvider>
  <ThemeProvider>
    {children}
    <ThemeLanguageSelector />
  </ThemeProvider>
</LanguageProvider>
```

### Component chuyển đổi nhanh
Component [ThemeLanguageSelector.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/components/ThemeLanguageSelector.tsx) hiển thị một widget nổi (floating widget) ở góc dưới bên phải màn hình để người dùng đổi nhanh ngôn ngữ và giao diện.

---

## 📝 4. Hướng dẫn thêm từ khóa dịch mới

Khi thêm văn bản mới vào giao diện:
1. Mở file [en.json](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/locales/en.json) và [vi.json](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/locales/vi.json).
2. Thêm khóa tương ứng vào đúng phân nhóm (ví dụ: `studio` hoặc `common`).
3. Sử dụng `t('phannhom.khoa_vua_them')` trong component TSX.
