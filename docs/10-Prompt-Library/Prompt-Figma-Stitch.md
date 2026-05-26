# Figma & Google Stitch Prompts — StemVerse UI/UX

Tài liệu này cung cấp các prompt tiếng Anh hoàn chỉnh (được tối ưu cho Google Stitch tại `stitch.withgoogle.com` hoặc Figma AI) để dựng wireframe và thiết kế giao diện cho dự án **StemVerse**.

---

## 🎨 1. Master Design System & Vibe Prompt (Quy định phong cách chung)

*Copy prompt này để thiết lập Theme/Style cho toàn bộ dự án trước khi generate màn hình chi tiết:*

```text
Create a premium, modern dark-themed music platform UI. 
- Theme: Deep slate dark mode (Background: #0B0F19, Surfaces: #1F2937, Borders: #2D3748).
- Accent Colors: Vibrant Neon Purple (#8B5CF6) for primary actions and active state, and Emerald Green (#10B981) for success/play states.
- Typography: Clean sans-serif headings with high contrast white text (#F9FAFB) and secondary gray text (#9CA3AF).
- Aesthetics: Sleek glassmorphism elements, thin border lines, subtle glowing neon shadows, and rounded corners (rounded-2xl / 16px).
- Vibe: Professional, high-tech, combining Spotify's dark music interface with GitHub's developer infrastructure aesthetic.
```

---

## 🖥️ 2. Core Screens Prompts (Màn hình chi tiết)

### 🎵 Màn hình 1: Landing Page / Explore Dashboard
*Mục tiêu: Trang chủ khám phá âm nhạc, tìm kiếm, hiển thị các bài hát gốc nổi bật kèm theo khung remix nhanh.*

```text
Design a web dashboard homepage for StemVerse, an AI-powered Music Marketplace.
- Layout: A sticky left sidebar navigation (Home, Explore, AI Studio, Wallet, Dashboard), a main content area, and a persistent dark audio player bar at the bottom.
- Hero Section: Centered layout with a bold headline "The GitHub + Spotify for Music Creators" in white and neon purple. Below it, a clean text input search bar with a placeholder "Remix 'Summer Breeze' into dark phonk..." and an Emerald Green button labeled "Remix".
- Main Content: 
  - A section titled "Trending Original Tracks" with a subtitle "Open for AI remixing & licensing".
  - Display a grid of 3 music cards. Each card contains: a mock album art placeholder with an overlay play button, track title, creator name, tag badge (e.g., "Synthwave"), and small key/BPM badges (e.g., "110 BPM", "A Minor") in clean monospace font.
- Bottom Audio Player: Full-width dark bar with album cover, song info, play/pause controls, progress bar slider, volume controls, and a button to view stems.
```

---

### 🎛️ Màn hình 2: Song Details & Stems Control Page
*Mục tiêu: Trang chi tiết bài hát, hiển thị waveform lớn và bảng điều khiển bật/tắt (mute/solo) các stem đã được tách bằng AI.*

```text
Design a song detail page for a modular music asset.
- Header: Show a large square album art (200x200) with rounded corners, song title "Summer Breeze", creator profile link, genre tag, key, and BPM. Include a prominent Emerald Green CTA button: "Open in AI Remix Studio".
- Audio Waveform: A large horizontal audio waveform player in the middle. The background waveform should be muted purple (#A78BFA with low opacity), and the active played part should be bright neon purple (#8B5CF6) with a glowing progress line indicator.
- Stems Panel: A section titled "Stems Control (AI Demucs separated)". 
- Grid of 4 Stem Cards (Vocals, Drums, Bass, Melody). Each card should be structured with:
  - Small category icon and stem label.
  - A waveform preview thumbnail.
  - A Toggle Mute button (highlighted in purple when active) and a Solo text link.
- License Options Section: A side card showing license buying options (Personal, Commercial, Remix, Exclusive) with prices in USD.
```

---

### ⚡ Màn hình 3: AI Remix Studio
*Mục tiêu: Studio remix bài hát bằng AI, có bảng nhập prompt, chọn preset phong cách và sơ đồ phân chia doanh thu (Royalty Split).*

```text
Design a split-screen layout for the AI Remix Studio.
- Left Panel (Control Panel):
  - A card titled "1. Text Prompt Description" containing a large, clean text area with placeholder "Make the drums faster, add deep bass distortion, synth arp overlays...".
  - A card titled "2. Choose Style Preset" showing a grid of selectable preset chips (Lofi, Phonk, Synthwave, Techno, Ambient, Anime).
  - A large action button "GENERATE AI REMIX" highlighted in emerald green (#10B981) with a lightning bolt icon.
  - A console-style status message at the bottom displaying logs like "Analyzing original audio structure..." and "Queueing AI Remix task...".
- Right Panel (Ownership & Royalty Info):
  - A card titled "Royalty Split Invariants" displaying a clean breakdown list: "Original Creator: 70%", "Remixer (You): 20%", "Platform Fee: 10%". Use subtle progress bars or a mini pie chart to visualize the split.
  - A disclaimer box below warning about the immutable copyright rules of the derivative remix.
```

---

### 💳 Màn hình 4: Creator Wallet & Analytics Dashboard
*Mục tiêu: Trang quản lý thu nhập, thống kê lượt stream/remix và lịch sử chia tiền bản quyền.*

```text
Design a dashboard analytics page for a music creator's wallet.
- Metric Cards: A row of 3 stat cards:
  - "Total Balance" showing "$150.00" in large green font, with a purple "Withdraw Payout" button.
  - "Total Streams" showing "142,500" with a green mini trend graph.
  - "Active Remixes" showing "28" phái sinh tracks.
- Royalty Splits Activity: A clean table showing recent earnings. Columns: "Date", "Source Track", "Remix Track", "Event Type" (e.g. license sale, stream), "Gross Amount", and "Net Payout".
- Ownership Graph Visualization Mock: A clean box displaying a tree graph visual, representing the original song at the root splitting into multiple remix nodes with percentage labels.
```
