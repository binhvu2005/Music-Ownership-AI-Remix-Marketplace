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

---

### 🔑 Màn hình 5: Sign In / Log In Screen (Xác thực đăng nhập)
*Mục tiêu: Giao diện đăng nhập tinh tế dạng card nổi trên nền tối, hỗ trợ đăng nhập thường và OAuth.*

```text
Design a clean, centered sign-in page for StemVerse on a deep slate background.
- Main Container: A central glassmorphic card with a neon purple border gradient.
- Logo: Display the StemVerse brand logo at the top (abstract waveform icon + "StemVerse" text).
- Header: Text reading "Welcome back" with a subtitle "Sign in to access your studio".
- Form Fields: 
  - An email input field with a placeholder "name@example.com" and a mail icon.
  - A password input field with a show/hide password toggle eye icon.
- Actions:
  - A "Forgot password?" link aligned to the right.
  - A full-width primary button "Sign In" in vibrant neon purple.
- Divider: A horizontal line with text "or continue with" in the middle.
- OAuth Buttons: A grid of 3 icon buttons: Google (colored G logo), Spotify (green circle logo), and Discord (blurple logo).
- Footer: A text link reading "Don't have an account? Sign up".
```

---

### 📝 Màn hình 6: Sign Up / Registration Screen (Đăng ký kèm phân vai)
*Mục tiêu: Giao diện đăng ký tài khoản mới, yêu cầu người dùng lựa chọn vai trò (Creator, Remixer, Fan).*

```text
Design a sign-up registration page for StemVerse.
- Main Container: A central glassmorphic card with rounded-2xl corners on a dark slate background.
- Title: "Create your account" with subtitle "Join the next generation of music ownership".
- Role Selection Grid: A critical section titled "Select your primary role". Show a horizontal grid of 3 selectable cards with icons:
  - "Original Creator" (icon of a cassette tape/mic) - for producers and singers.
  - "AI Remixer" (icon of a lightning/waveform) - for generating derivative tracks.
  - "Listener / Fan" (icon of headphones) - for discovering and buying licenses.
- Form Fields: 
  - Username input field with a placeholder "@username".
  - Email input field.
  - Password input field with strength indicator bar.
- Agreement Checkbox: A small checkbox with text "I agree to the Terms of Service and DRM Licensing Agreement".
- Button: A full-width primary button "Create Account" in neon purple.
- Footer: Link to "Already have an account? Sign in".
```

---

### 👤 Màn hình 7: User Profile & Personal Settings (Thông tin cá nhân & Thiết lập)
*Mục tiêu: Trang chỉnh sửa thông tin cá nhân, liên kết ví, hiển thị vai trò và thống kê hoạt động.*

```text
Design a modern user profile and settings dashboard page.
- Layout: Top header bar with notifications and profile dropdown, main content grid with left-hand sidebar navigation.
- Profile Header: A wide banner area with a dark gradient. 
  - A circular avatar frame on the left with a camera edit icon.
  - User's display name "Cyber Producer" next to an Emerald Green verified checkmark badge and a role label "Creator".
  - A short bio: "Electronic music producer exploring AI-driven stems and modular ownership. 🎧".
  - Quick stats row: "14 Songs Uploaded", "154 Remixes Spawned", "8.2K Followers".
- Settings Form Grid:
  - "Profile Information" section with fields: Display Name, Public Email, Bio.
  - "Wallet Settings" card displaying: "Connected Wallet Address" showing a mock crypto address (e.g. 0x71C...897) with a "Disconnect" button, and automatic Stripe Connect status (indicated as "Connected").
  - Save Changes button at the bottom highlighted in neon purple.
```

---

### 📤 Màn hình 8: Upload Music Page (Trang tải nhạc & Stems)
*Mục tiêu: Giao diện cho phép kéo thả file nhạc gốc, tải lên các stem riêng lẻ và cấu hình bản quyền & doanh thu.*

```text
Design a web page for uploading songs and audio stems for StemVerse.
- Main area: A split layout on a deep slate background.
- Left column (Audio Files Upload):
  - A large dotted drag-and-drop zone with a cloud icon labeled "Upload Full Track (.wav, .mp3, max 50MB)".
  - A section titled "Stems Upload (Optional)" displaying 4 smaller drop zones for separated tracks: Vocals, Drums, Bass, Melody. Each with a progress bar and delete icon.
- Right column (Metadata & Rights):
  - Text fields for Song Title, Genre dropdown, BPM, Key (e.g. C#m), Mood tags.
  - Switches for "Allow AI Remixing", "Allow Commercial Licensing", and "Allow AI Voice Cloning".
  - A royalty slider showing "Remixer Split: 20%" and "Creator Split: 70%" (Platform split fixed at 10%).
  - A neon purple "Publish Song" button.
```

---

### 💳 Màn hình 9: Marketplace & Licensing Checkout (Trang thanh toán bản quyền)
*Mục tiêu: Popup hoặc trang thanh toán khi mua license nhạc, hỗ trợ nhiều cổng thanh toán.*

```text
Design a licensing details and payment checkout modal for StemVerse.
- Layout: Centered pop-up card with glassmorphism styling on dark background.
- Header: Song thumbnail, title "Summer Breeze", creator "Original Creator", license type "Commercial License".
- Left side (License Details):
  - Bullet points describing usage rights: "✔ Commercial streaming allowed", "✔ Synchronization rights included", "✖ AI Voice Cloning prohibited", "✔ 20% Remix Royalty Split agreement".
- Right side (Checkout Card):
  - Price display "$29.99" in bold green font.
  - Payment method tabs: "Card / Stripe", "MoMo (QR)", "VNPay".
  - Interactive credit card inputs (Card Number, Expiry, CVC) on dark field style.
  - A secure lock icon next to a solid green "Pay $29.99 Now" button.
```

---

### 🛡️ Màn hình 10: Admin Control Panel (Bảng quản trị hệ thống)
*Mục tiêu: Giao diện dành cho admin để theo dõi doanh thu, xử lý khiếu nại bản quyền và quản lý user.*

```text
Design an admin control panel dashboard for StemVerse managers.
- Layout: Dark theme with a left sidebar nav (Overview, Copyright Disputes, User Audit, Billing), top bar with global search.
- Overview Section:
  - Metric blocks showing: "Platform Earnings: $14,250", "Pending Disputes: 8", "Total Songs: 1,420", "Banned Creators: 3".
  - Chart area: A line graph tracking platform transactions over time.
- Copyright Disputes List:
  - A table showing active disputes: "Dispute ID", "Song Title", "Claimant", "Original Owner", "Status" (Pending / Resolved), and action buttons "Investigate" / "Resolve".
- User Management Panel:
  - List of flagged users with a red "Ban User" button.
```

---

### 👥 Màn hình 11: Realtime Collab Studio & Social Remix Battle (Màn hình cộng tác & Remix Battle)
*Mục tiêu: Giao diện phòng collab thời gian thực hiển thị cursor của nhiều user và bảng xếp hạng Remix Battle.*

```text
Design a realtime multiplayer audio collaboration studio and social remix battle page.
- Top Bar: Display active user avatars with green status dots (multiplayer presence), and a glowing orange "Live" badge.
- Timeline Area: A horizontal multitrack editor (Track 1: Vocals, Track 2: Drums, Track 3: Remix Synth).
  - Show colored markers indicating the playback heads and cursor locations of other online users (e.g., "User A editing drums", "User B adding reverb").
- Remix Battle Card:
  - Banner: "Synthwave Remix Battle #12".
  - Leaderboard table: Rank, Remix Title, Creator, Votes, and a "Vote" thumbs-up button.
  - Subtitle: "Submit your remix entry before May 30th".
```

---

### 🎤 Màn hình 12: AI Voice Library & Voice Cloning Page (Thư viện Giọng ca AI & Nhân bản Giọng hát)
*Mục tiêu: Giao diện khám phá các giọng ca AI đã được xác thực của các Creator và bảng điều khiển tải lên mẫu thử âm thanh để huấn luyện mô hình giọng nói cá nhân.*

```text
Design a responsive web dashboard for the StemVerse AI Voice Library.
- Header: Title "AI Voice Library" with a subtitle "Browse and license authenticated AI voice models or train your own." An emerald green primary button on the right labeled "+ Train My Voice".
- Grid of Voice Cards: Show 3 columns of selectable AI Voice Cards. Each card includes:
  - Circle avatar representing the voice owner, with a small verified checkmark.
  - Voice Name (e.g. "Vocaloid-Sophia v2") and Creator name.
  - Attributes: Tag badges showing Gender ("Female"), Vocal Type ("Alto / Husky"), Style ("Dreampop, Synthwave"), and Price (e.g. "$15 / license").
  - An inline audio play slider to preview the voice singing a demo phrase.
  - A neon purple action button "Use Voice in Studio" or "License Voice".
- "Train My Voice" Slide-over Panel (or section): A mockup of the training wizard containing:
  - Step indicator: "1. Upload 10-min clean vocal samples (.wav)" -> Drag-and-drop zone.
  - Step indicator: "2. Set Licensing Model" -> Pricing inputs and royalty share agreement checkboxes.
```

---

### 🌳 Màn hình 13: Interactive Song Lineage & Ownership Graph (Sơ đồ Phả hệ Sở hữu & Dòng chảy Bản quyền)
*Mục tiêu: Sơ đồ phả hệ dạng cây phân nhánh giúp người dùng theo dõi nguồn gốc bài hát gốc, các bản remix phái sinh, tỷ lệ chia doanh thu và tổng tiền bản quyền đã được phân phối ở từng nhánh.*

```text
Design a fullscreen interactive user interface for the Song Lineage & Ownership Graph Explorer.
- Header: Song name "Summer Breeze (Original)" by Creator X, with a total remix count "28 derivatives" and total royalty generated "$3,200.00".
- Visual Canvas: A large dark canvas area showing a horizontal or vertical tree-graph structure (mind map style).
  - Root Node: Glowing emerald green border card containing the original track info, owner name, and "100% Core Rights".
  - Child Nodes (Branches): Connected with glowing purple lines. Multiple derivative remix nodes (e.g., "Summer Phonk Remix by User B" - showing a "20% Remixer, 70% Creator, 10% Platform" split badge, and a "Revenue Earned: $450" label).
  - Sub-child Nodes: Further branches indicating remix of a remix (e.g., "Nightcore Edit of Phonk Remix" with its respective splits).
- Hover Tooltip Mockup: A small dark popover overlay on a selected node showing: Remix prompt used, creation date, active licenses purchased, and a button to play/preview this specific remix.
```

---

### 🏆 Màn hình 14: Remix Battle Details & Voting Page (Chi tiết Cuộc thi Remix & Bình chọn)
*Mục tiêu: Trang chi tiết của một cuộc thi remix đang diễn ra, hiển thị giải thưởng, thể lệ, bài hát gốc làm đề bài, danh sách các bài dự thi kèm nút nghe thử và bình chọn.*

```text
Design a webpage detail view for a StemVerse Remix Battle.
- Top Hero Section: A large glowing banner titled "Synthwave Remix Battle #12" with a countdown timer "Ends in: 3d 12h 45m" and a prize pool badge "Prize: $1,000 + 50% Platform Fee Share".
- Left Panel:
  - Battle Rules: Bullet list describing terms (e.g. "Must use vocals from 'Dreaming Out Loud'", "Submissions close May 30th", "Winner chosen by community vote").
  - Target Track Card: Displays the original song art, title, play button, and an Emerald Green button: "Remix This Song in Studio".
- Right Panel (Submissions & Voting):
  - A header "Entries (142)" with tabs: "Trending", "Top Voted", "Recent".
  - A scrollable list of remix entries. Each entry shows: Rank badge (e.g., #1, #2), Remixer avatar and username, waveform player, vote counter, and a thumbs-up "Vote" button (glowing orange when clicked).
  - A floating CTA button at the bottom: "Submit Your Entry".
```

---

### 📰 Màn hình 15: Social Activity Feed (Bảng tin Hoạt động Cộng đồng)
*Mục tiêu: Dòng thời gian hiển thị các hoạt động xã hội như đăng bài hát mới, tạo remix mới, lượt like, bình luận và chia sẻ trong hệ sinh thái âm nhạc StemVerse.*

```text
Design a social activity feed layout for the StemVerse community.
- Layout: Three-column layout.
  - Left Sidebar: Short user profile summary (avatar, followers, edit profile) and navigation links.
  - Center Feed: A feed of scrollable activity posts.
    - Post Example 1: "User A remixed 'Neon Horizon' by User B" -> Displays a embedded mini player card with waveform, remix prompt "Make it drum and bass", like/repost/comment icons, and a comment input box.
    - Post Example 2: "User C purchased a Commercial License for 'Midnight City'" -> Displays a purchase receipt graphic with positive green indicator badges.
  - Right Sidebar: "Trending Remix Prompts" list (e.g., #phonk, #spedup, #ambientsynth) and "Creators to Follow" recommendations.
```

---

### 🛒 Màn hình 16: Sound Packs & AI Assets Marketplace (Chợ mua bán Sound Packs, Loops & Presets)
*Mục tiêu: Khu vực chợ mua bán dành riêng cho các gói âm thanh (Sound Packs), vòng lặp (Loops), bộ mẫu tiếng (Samples), và các thiết lập hiệu ứng AI (presets).*

```text
Design a digital marketplace page for sound packs, loops, and AI audio assets.
- Hero Banner: Modern heading "Producer Sound Assets" with description "Buy royalty-free stems, vocal presets, and drum loops to elevate your productions."
- Filters Sidebar: Left-hand filter menu with collapsible sections: Category (Vocal Pack, Drum Loop, Synth Preset, SFX), Price Range slider, Key, BPM range, and Seller rating.
- Grid Layout: 4 columns of asset card items. Each card contains:
  - A stylized colorful cover artwork.
  - Pack Title (e.g. "Vaporwave Synth Loops Vol. 1") and Seller name.
  - Format badges (e.g. "50 WAV Loops", "10 Serum Presets").
  - Price label (e.g. "$19.99") and a quick "Add to Cart" shopping cart icon button.
  - A small play button on the cover to play an audio demo preview.
```

---

### 🔔 Màn hình 17: Notification Center & Activity Log Inbox (Trung tâm Thông báo & Lịch sử Hoạt động)
*Mục tiêu: Hộp thư thông báo chi tiết phân loại theo danh mục: Tiền bản quyền nhận được (Royalties), hoạt động remix bài hát của mình (Remixes), tương tác mạng xã hội (Social) và cảnh báo hệ thống/tranh chấp (System).*

```text
Design a clean, modern notification center inbox page.
- Layout: Center-aligned list card on a dark slate background, with tabs for filtering: "All", "Royalties", "Remixes", "Social", "System".
- Notification Items List:
  - Item 1 (Royalty split): Icon of money bag. Text: "You earned $14.20 from 'Summer Breeze (Lofi Edit)' streams." with a timestamp and a "View Statement" link.
  - Item 2 (Remix activity): Icon of lightning/waveform. Text: "User X just remixed your track 'Blue Ocean' using AI Remix Studio." with a link to view the new remix and its split graph.
  - Item 3 (Social comment): Icon of chat bubble. Text: "User Y commented on your remix: 'This drop is insane! 🔥'" with a reply button.
  - Item 4 (System dispute): Icon of warning sign. Text: "System flag: A copyright dispute has been opened for your track 'Remix A1'." in yellow text with a "Resolve Now" action button.
```

---

### 💳 Màn hình 18: Creator Onboarding & Payout Settings (Thiết lập Ví & Liên kết Stripe/MoMo)
*Mục tiêu: Trang thiết lập phương thức thanh toán dành cho Creator để liên kết tài khoản Stripe Connect, ví MoMo, hoặc VNPay nhằm nhận tiền bản quyền tự động rút về ví.*

```text
Design a payout onboarding and wallet configuration settings page.
- Header: Title "Payout Settings" with subtitle "Manage how you receive royalty payments and marketplace earnings."
- Onboarding Cards:
  - Card 1: "Stripe Connect" for international bank transfers. Shows a status badge "Not Connected" or "Connected", input field for Registered Legal Name, and a dark purple button "Setup Stripe Payouts".
  - Card 2: "MoMo Wallet Link" for Vietnamese local payouts. Shows a status badge "Connected" with the connected phone number (e.g. "098***1234"), and a disconnect link.
  - Card 3: "VNPay Business API". Shows input fields for VNPay Merchant ID, API keys, and a toggle for "Auto-Withdraw Weekly earnings".
- Minimum Payout Threshold Card: A slider showing minimum payout amounts (e.g. "$10", "$50", "$100") and a checklist of required tax documents.
```

---

### ⚖️ Màn hình 19: Copyright Dispute Investigation (Admin/Mediator Panel) (Trang Quản trị Viên Giải quyết Tranh chấp Bản quyền)
*Mục tiêu: Giao diện dành riêng cho Admin hoặc người hòa giải để so sánh trực quan dạng sóng âm (waveform) của hai bài hát tranh chấp, xem tỷ lệ tương đồng do AI phân tích và đưa ra quyết định xử lý.*

```text
Design a split-screen copyright dispute investigation interface for administrators.
- Header: Title "Dispute Case #98231 - Copyright Infringement Claim". Status badge: "Under Investigation" in yellow.
- Left Column (Claimant's Song):
  - Displays original track cover, title "Ocean Waves", creator name, upload timestamp.
  - Audio player with a high-detail waveform. Highlighted in orange brackets are specific time ranges identified by AI as overlapping (e.g., "0:45 - 1:12").
- Right Column (Disputed Song):
  - Displays disputed track cover, title "Tsunami Beats", creator name, upload timestamp.
  - Audio player with its waveform. Similar overlapping segment highlighted in orange (e.g., "1:15 - 1:42").
- AI Similarity Analyzer Panel (Middle/Bottom):
  - A card showing "AI Match Confirmed: 84% Melodic Similarity" with key comparisons (BPM match: 120/120, Key match: E Minor).
- Mediator Actions Panel:
  - Text area for mediator notes.
  - Actions: Three buttons: "Reject Claim" (gray), "Issue Takedown" (red), "Adjust Royalty Split (Assign 50% to Claimant)" (purple).
```

---

### 💎 Màn hình 20: Pricing & Premium Subscriptions (Gói cước & Đăng ký Premium)
*Mục tiêu: Trang hiển thị bảng giá các gói đăng ký dịch vụ của StemVerse (Free, Creator Pro, Studio Master) để mua thêm lượt generate remix bằng AI, tải lên âm thanh chất lượng cao không nén, hoặc mở khóa giới hạn mô hình giọng nói.*

```text
Design a clean, premium pricing and subscription plans page.
- Header: Title "Choose Your Creative Power" with a subtitle "Upgrade to unlock advanced AI remix credits, lossless audio stems, and private voice cloning models." Includes a toggle for "Billed Monthly / Billed Yearly (Save 20%)".
- Plan Columns: 3 vertical pricing cards.
  - Plan 1: "Listener / Fan" (Free). Price "$0". List of simple features with checkmarks (standard streaming, follow creators, write comments).
  - Plan 2: "Creator Pro" (Most Popular - with glowing neon purple border and ribbon). Price "$14.99 / mo". List of features: "100 AI Remix Credits/mo", "Lossless WAV Stem uploads", "1 Custom AI Voice Model training", "Auto-Stripe splits". Action button: "Start 7-Day Free Trial".
  - Plan 3: "Studio Master". Price "$49.99 / mo". List of features: "Unlimited AI Remix Credits", "API Access for batch separations", "5 Custom AI Voice Models", "Priority GPU processing", "Premium support". Action button: "Contact Sales".
```
