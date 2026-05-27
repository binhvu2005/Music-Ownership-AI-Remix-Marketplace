---
title: Design Spec - Music Ownership Graph & Royalty Split Engine
date: 2026-05-27
status: Approved
tags: [spec, ownership, royalty, backend, frontend, d3js]
---

# Design Spec: Music Ownership Graph & Royalty Split Engine

## 1. Goal
Xây dựng hệ thống quản lý cây phả hệ sở hữu âm nhạc (Ownership Graph) cho phép theo dõi quan hệ bài hát gốc (Original) và các bản phối lại (Remix) qua nhiều cấp, tự động phân phối doanh thu đệ quy (Royalty Split) vào ví ảo (Virtual Wallet) của từng bên thụ hưởng khi có sự kiện thanh toán thành công, và trực quan hóa cây sở hữu dưới dạng đồ họa (D3.js) trên Frontend.

## 2. Architecture & Data Flow

Hệ thống bao gồm các cấu phần chính sau:

```text
[Payment Webhook / Purchase Event]
                ↓
     [Royalty Split Engine] ──(Query Adjacency List)──> [PostgreSQL Database]
                ↓
     [Distribute to Wallets] ──(Create Transactions)──> [User Wallets & History]
                ↓
       [WebSocket Gateway] ──(Emit: wallet:updated)──> [Next.js Frontend]
```

### 2.1. Cấu trúc quan hệ sở hữu (Adjacency List)
Sử dụng bảng `ownership_relations` để lưu các nút quan hệ sở hữu.
- **Bài hát gốc (Original Song A)**:
  - Bản ghi sở hữu: `parent_song_id = null, child_song_id = A, owner_id = X, split_percentage = 100.00, relationship_type = 'original'`.
- **Bài hát Remix B của A (Remixer Y)**:
  - Bản ghi sở hữu: `parent_song_id = A, child_song_id = B, owner_id = Y, split_percentage = 20.00, relationship_type = 'remix'`.
- **Bài hát Remix C của B (Remixer Z)**:
  - Bản ghi sở hữu: `parent_song_id = B, child_song_id = C, owner_id = Z, split_percentage = 20.00, relationship_type = 'remix'`.

### 2.2. Thuật toán phân chia tiền đệ quy (Recursive Royalty Calculation)
Khi bài hát C được mua với số tiền `amount`:
- **Vòng lặp đệ quy**:
  - Tại mỗi nút remix (nút có `parent_song_id !== null`):
    - Trích phí Platform = `10%` số tiền hiện tại của cấp đó.
    - Trích phí Remixer = `split_percentage` (mặc định 20%) số tiền hiện tại của cấp đó.
    - Số tiền còn lại = `tiền hiện tại - phí Platform - phí Remixer`.
    - Di chuyển lên nút cha `parent_song_id` với số tiền còn lại.
  - Tại nút gốc (nút có `parent_song_id === null`):
    - Trích phí Platform = `10%` số tiền hiện tại của cấp gốc.
    - Toàn bộ phần còn lại thuộc về Creator gốc.
    - Dừng thuật toán.

## 3. API Endpoints

### Ownership API (`/music/ownership`)
- `GET /music/ownership/:songId/graph`: Trả về dữ liệu các node và link để frontend vẽ đồ thị D3.js.
  ```json
  {
    "nodes": [
      { "id": "uuid-A", "title": "Summer Breeze", "owner": "Original Creator", "type": "original" },
      { "id": "uuid-B", "title": "Summer Breeze Phonk Remix", "owner": "AI Remixer", "type": "remix" }
    ],
    "links": [
      { "source": "uuid-A", "target": "uuid-B", "split": 20 }
    ]
  }
  ```
- `GET /music/ownership/:songId/ancestors`: Trả về toàn bộ danh sách bài hát tổ tiên (bài hát gốc, bài hát remix trung gian).
- `GET /music/ownership/:songId/descendants`: Trả về toàn bộ danh sách các bài phối lại (children/remixes) ở tất cả các cấp con cháu.

### Royalty API (`/royalty`)
- `GET /royalty/wallet`: Lấy số dư ví ảo hiện tại của người dùng đăng nhập.
- `GET /royalty/transactions`: Lấy danh sách lịch sử giao dịch chia tiền của người dùng.

---

## 4. Frontend Graph Visualization (D3.js)
- Tại trang chi tiết bài hát, thêm Tab **"Ownership Graph"**.
- Sử dụng thư viện D3.js (hoặc SVG thuần đơn giản/Mermaid) vẽ cây liên kết dạng sơ đồ cây nằm ngang (tree layout) trực quan, có các node clickable dẫn đến trang chi tiết của từng bài hát liên quan.
