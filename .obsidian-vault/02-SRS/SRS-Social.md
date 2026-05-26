---
title: SRS — Social System
type: spec
project: StemVerse
module: social
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - social
  - community
---

# SRS — Social System

## Problem

StemVerse cần community layer để users tương tác, follow creators và tham gia remix battles.

## Goal

Xây dựng Social System:
- Like, comment trên tracks
- Follow creators
- Creator profiles
- Remix battles

## Scope

**In scope:**
- Likes (tracks + remixes)
- Comments (nested, max 2 levels)
- Follow / Unfollow creators
- Creator profile page
- Remix battles (community voting)

**Out of scope:**
- Direct messaging
- Stories/Reels
- Live streaming

## Technical Design

### Feed Algorithm (simple)

```
User Feed = 
  tracks from followed creators (sorted by created_at)
  + trending tracks (top trending_score)
  + recommended (based on listened genres)
```

### Remix Battle Rules

```
- Creator A vs Creator B remix cùng một bài gốc
- Duration: 7 days
- Voting: community likes
- Winner: highest likes trong 7 days
- Reward: Featured badge + profile boost
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/social/likes/:songId` | User | Like/unlike song |
| GET | `/social/comments/:songId` | Public | Lấy comments |
| POST | `/social/comments/:songId` | User | Post comment |
| DELETE | `/social/comments/:commentId` | User | Xóa comment của mình |
| POST | `/social/follow/:userId` | User | Follow creator |
| DELETE | `/social/follow/:userId` | User | Unfollow |
| GET | `/social/feed` | User | Personal feed |
| GET | `/social/profiles/:userId` | Public | Creator profile |
| GET | `/social/battles` | Public | Active remix battles |
| POST | `/social/battles` | Creator | Tạo remix battle |

## Database

```sql
-- likes table
id      UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
song_id UUID REFERENCES songs(id)
created_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, song_id)

-- comments table
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
song_id     UUID REFERENCES songs(id)
parent_id   UUID REFERENCES comments(id) NULL
content     TEXT NOT NULL
created_at  TIMESTAMP DEFAULT NOW()

-- follows table
id              UUID PRIMARY KEY
follower_id     UUID REFERENCES users(id)
following_id    UUID REFERENCES users(id)
created_at      TIMESTAMP DEFAULT NOW()
UNIQUE(follower_id, following_id)

-- remix_battles table
id              UUID PRIMARY KEY
song_id         UUID REFERENCES songs(id)
creator_a_id    UUID REFERENCES users(id)
remix_a_id      UUID REFERENCES songs(id)
creator_b_id    UUID REFERENCES users(id)
remix_b_id      UUID REFERENCES songs(id)
start_at        TIMESTAMP
end_at          TIMESTAMP
winner_id       UUID REFERENCES users(id) NULL
status          ENUM('active','ended')
```

## Acceptance Criteria

- [ ] Like/unlike track hoạt động
- [ ] Comments nested 2 levels
- [ ] Follow/Unfollow creator
- [ ] Feed hiển thị tracks từ followed creators
- [ ] Creator profile hiển thị stats (followers, tracks, remixes)
- [ ] Remix battle voting hoạt động

## Related

- [[User-Roles]]
- [[SRS-Marketplace]]
