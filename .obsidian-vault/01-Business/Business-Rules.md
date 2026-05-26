---
title: StemVerse — Business Rules
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - business
  - rules
  - ownership
  - licensing
---

# StemVerse — Business Rules

## 1. Ownership Rules

### 1.1 Quyền sở hữu gốc
- **Original Creator** = người upload bài nhạc gốc đầu tiên
- Platform **KHÔNG claim** bất kỳ ownership nào
- Uploader chịu toàn bộ trách nhiệm pháp lý: *"I own or have rights to upload this content"*

### 1.2 Derivative Ownership (Remix)
- Mỗi remix tạo một **child node** trong ownership graph
- Ownership split được **negotiate tại thời điểm remix**
- Default split nếu không configure:

| Party | % Default |
|-------|-----------|
| Original Creator | 70% |
| Remixer | 20% |
| Platform | 10% |

### 1.3 Multi-level Derivatives
- Remix của remix được phép (nếu license cho phép)
- Ownership chain được track đến N levels
- Royalty chia theo **chain**: mỗi parent nhận phần của mình

```
Original Track (Creator A: 100%)
  └── Remix A (Creator A: 70%, Remixer B: 20%, Platform: 10%)
       └── Remix A1 (Creator A: 42%, Remixer B: 14%, Remixer C: 34%, Platform: 10%)
```

---

## 2. Licensing Rules

### 2.1 Loại License

| Type | Mô tả | Remix Allowed | Commercial |
|------|-------|---------------|------------|
| **Personal License** | Chỉ dùng cá nhân, phi thương mại | ❌ | ❌ |
| **Commercial License** | Dùng kiếm tiền (YouTube, ads, game) | ❌ | ✅ |
| **Remix License** | Được phép remix | ✅ | ❌ |
| **Exclusive License** | Một người duy nhất, full rights | ✅ | ✅ |

### 2.2 License Rules Matrix

```
License Config per Song (Creator sets):
✔ Commercial Use Allowed
✔ Remix Allowed
✖ AI Voice Cloning
✔ Revenue Sharing Required
✖ Exclusive Mode
```

### 2.3 License Expiry
- **Personal / Commercial / Remix**: Perpetual (không hết hạn)
- **Exclusive**: Có thể có expiry date (negotiated)

---

## 3. Royalty Rules

### 3.1 Revenue Sources

| Source | Mô tả |
|--------|-------|
| Stream | Theo số lượt stream (subscription pool) |
| Commercial License | Flat fee khi mua |
| Remix Sales | % từ remix được bán |
| Marketplace | Stems, loops, vocal packs |
| Subscription | Premium user fee |

### 3.2 Distribution Timing
- Royalty được tính **real-time** cho mỗi event
- Payout cho creator: **hàng tháng** hoặc khi đạt threshold $50

### 3.3 Platform Fee
- **5–15%** transaction fee tùy loại
- **10%** royalty share cố định từ mọi revenue stream

---

## 4. AI Usage Rules

### 4.1 AI Remix
- AI chỉ được remix nếu bài gốc có `remix_allowed = true`
- Mỗi AI remix **tự động tạo ownership record**
- Prompt của user được lưu trong `remix_prompt` field

### 4.2 AI Voice System
- ✅ Cho phép: Creator upload licensed AI voice của chính mình
- ✅ Cho phép: Custom voice packs từ consenting artists
- ❌ **CẤMTUYỆT ĐỐI**: Celebrity voice cloning
- ❌ **CẤMTUYỆT ĐỐI**: Unauthorized voice imitation

### 4.3 Content Moderation
- AI model scan nội dung upload (NSFW audio detection)
- DMCA fingerprint check trước khi publish
- Anti-piracy watermark được nhúng vào mọi bản phát hành

---

## 5. Security Rules

### 5.1 Audio Protection
- **DRM-style streaming**: HLS với signed URLs (expire sau 1h)
- **Anti-piracy watermark**: Invisible audio watermark chứa user ID
- **Signed download URLs**: Chỉ có hiệu lực sau khi xác thực license

### 5.2 Rate Limiting
| Endpoint | Limit |
|----------|-------|
| Upload | 10 uploads/hour |
| AI Remix | 5 remixes/hour (free), 50/hour (premium) |
| Stream | 100 req/min |
| API | 1000 req/hour |

---

## 6. Legal Framework

### 6.1 DMCA Compliance
- Có form báo cáo DMCA takedown
- Xử lý trong **48 giờ**
- Counter-notice process theo luật DMCA

### 6.2 Terms of Service
- User xác nhận ownership khi upload
- Platform có quyền xóa nội dung vi phạm
- Dispute resolution process

### 6.3 Content Moderation
- AI abuse prevention
- Human review team cho các case phức tạp
- 3-strike system: Warning → Suspend → Ban

---

## 7. Dispute Resolution

### 7.1 Quy trình tranh chấp
1. User báo cáo vi phạm
2. Admin review trong 72 giờ
3. Freeze royalty của nội dung bị tranh chấp
4. Notify cả hai bên
5. Resolve: Xóa nội dung / Chuyển ownership / Dismiss

---

## Related

- [[StemVerse-Overview]]
- [[User-Roles]]
- [[SRS-Ownership-Graph]]
- [[SRS-Licensing]]
- [[SRS-Royalty-Engine]]
- [[ADR-007-Demucs-Stem-Separation]]
- [[Table-Ownership-Relations]]
- [[Table-Licenses]]
