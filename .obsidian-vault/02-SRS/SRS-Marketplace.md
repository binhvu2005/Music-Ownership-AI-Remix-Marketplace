---
title: SRS — Marketplace System
type: spec
project: StemVerse
module: marketplace
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - marketplace
---

# SRS — Marketplace System

## Problem

Creator cần nơi bán không chỉ nhạc hoàn chỉnh mà còn cả stems, loops, vocal packs, FX presets — các asset âm nhạc riêng lẻ.

## Goal

Xây dựng Marketplace:
- Browse/search assets
- Mua/bán: full songs, stems, loops, vocal packs, FX presets, remix templates
- Trending + categories + tags
- Secure download sau purchase

## Scope

**In scope:**
- Asset types: Music, Stems, Loops, Vocal Packs, FX Presets, Remix Templates
- Search + filter (genre, BPM, key, mood, tags, price)
- Trending algorithm
- Purchase + secure download
- Creator storefront page

**Out of scope:**
- Auction system
- Bidding
- NFT marketplace (Phase 3)

## Technical Design

### Asset Types

| Type | Mô tả | Upload By |
|------|-------|---------|
| Full Song | Complete track | Creator |
| Stems | Individual stems (vocals, drums, ...) | Creator |
| Loop | Short repeatable clip | Creator |
| Vocal Pack | Collection of vocal samples | Creator |
| FX Preset | Audio effect settings | Creator |
| Remix Template | Project template for remixing | Creator |

### Search & Discovery

**Search Engine**: Meilisearch (primary)

Indexed fields:
- `title`, `description`, `tags`
- `genre`, `mood`
- `bpm` (range filter)
- `key`
- `price` (range filter)
- `type` (filter)
- `trending_score` (sort)

**Trending Algorithm**:
```
trending_score = (streams × 1) + (purchases × 5) + (remixes × 3)
               - (age_in_days × 0.1)
               
Recalculate: every 1 hour (cron)
```

### Secure Download Flow

```
User requests download
    ↓
[API] Validate: user has valid license for this asset
    ↓
[API] Generate presigned R2 URL (expire: 1 hour)
    ↓
[Client] Download directly from R2 via signed URL
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/marketplace/assets` | Public | Browse assets (paginated) |
| GET | `/marketplace/assets/:id` | Public | Asset detail |
| GET | `/marketplace/search` | Public | Search assets |
| GET | `/marketplace/trending` | Public | Trending assets |
| GET | `/marketplace/categories` | Public | Danh sách categories |
| POST | `/marketplace/assets` | Creator | Đăng bán asset |
| PUT | `/marketplace/assets/:id` | Creator | Update asset |
| DELETE | `/marketplace/assets/:id` | Creator | Xóa asset |
| GET | `/marketplace/assets/:id/download` | User | Get signed download URL |
| GET | `/marketplace/creator/:userId` | Public | Creator storefront |

## Database

```sql
-- marketplace_assets table
id              UUID PRIMARY KEY
song_id         UUID REFERENCES songs(id) NULL   -- null nếu standalone asset
seller_id       UUID REFERENCES users(id)
title           VARCHAR(255) NOT NULL
description     TEXT
type            ENUM('full_song','stem','loop','vocal_pack','fx_preset','remix_template')
price           INTEGER NOT NULL         -- cents (0 = free)
file_url        TEXT NOT NULL
preview_url     TEXT                     -- 30s preview
tags            TEXT[]
genre           VARCHAR(50)
bpm             INTEGER
key             VARCHAR(10)
mood            VARCHAR(50)
trending_score  DECIMAL(10,2) DEFAULT 0
total_streams   INTEGER DEFAULT 0
total_purchases INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP
```

## Edge Cases

| Case | Handling |
|------|---------|
| Asset bị report vi phạm | Flag, admin review, potential removal |
| Creator xóa account | Deactivate assets, existing licenses valid |
| Price thay đổi | Existing purchases không bị ảnh hưởng |
| Search timeout | Cache results, fallback to basic filter |

## Acceptance Criteria

- [ ] Browse assets có pagination và filter
- [ ] Search trả về kết quả trong 200ms
- [ ] Trending cập nhật mỗi giờ
- [ ] Creator có thể upload và quản lý assets
- [ ] Secure download chỉ cho users có license
- [ ] Presigned URL expire sau 1 giờ

## Related

- [[SRS-Licensing]]
- [[SRS-Royalty-Engine]]
- [[API-Marketplace]]
- [[ADR-006-Cloudflare-R2-Storage]]
