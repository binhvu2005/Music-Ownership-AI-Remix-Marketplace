---
title: SRS — Ownership Graph System
type: spec
project: StemVerse
module: ownership-graph
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - ownership
  - graph
  - core-innovation
---

# SRS — Ownership Graph System

## Problem

Music có derivative works (remixes, covers, edits) nhưng không có hệ thống track ownership hierarchy một cách rõ ràng. Creator mất kiểm soát bài nhạc khi bị remix.

## Goal

Xây dựng **GitHub-style ownership graph** cho music:
- Track toàn bộ parent-child relationships
- Hiển thị visual ownership tree
- Tự động tính royalty split theo chain
- Immutable audit trail

## Scope

**In scope:**
- Ownership record tạo khi upload + khi publish remix
- Parent-child relationship tracking (N levels)
- Visual ownership tree (D3.js / Mermaid)
- Royalty split configuration per relationship
- Read-only audit trail

**Out of scope:**
- On-chain (blockchain) storage (Phase 3)
- Legal contract generation

## Core Concept

```
Original Track (id: A)
├── Owner: Creator X (100% rights)
├── Remix A (id: B) — child of A
│   ├── Owner: Creator X (70%), Remixer Y (20%), Platform (10%)
│   ├── Remix A1 (id: D) — child of B
│   │   ├── Owner: X+Y split from B * 70% + Remixer Z 20%
│   │   └── Remix A2 (id: E)
└── Remix B (id: C) — child of A
    └── Owner: Creator X (70%), Remixer W (20%), Platform (10%)
```

## Technical Design

### Ownership Data Model

Mỗi **ownership_node** chứa:
- `song_id`: ID bài nhạc (có thể là remix)
- `owner_id`: User sở hữu
- `parent_song_id`: ID bài gốc (null nếu là original)
- `split_percentage`: % royalty nhận được
- `license_rules`: JSON config
- `created_at`: Immutable timestamp

### Graph Storage Strategy

Dùng **Adjacency List** trong PostgreSQL:

```sql
-- ownership_relations table
id              UUID PRIMARY KEY
parent_song_id  UUID REFERENCES songs(id) NULL   -- null nếu original
child_song_id   UUID REFERENCES songs(id) NOT NULL
owner_id        UUID REFERENCES users(id) NOT NULL
split_percentage DECIMAL(5,2) NOT NULL    -- % royalty nhận
relationship_type ENUM('original','remix','cover','sample')
license_rules   JSONB
created_at      TIMESTAMP DEFAULT NOW()

-- Indexes:
-- INDEX ON parent_song_id
-- INDEX ON child_song_id
-- INDEX ON owner_id
```

### Graph Traversal (Recursive CTE)

```sql
-- Lấy toàn bộ ownership tree cho một song
WITH RECURSIVE ownership_tree AS (
  -- Base case: original song
  SELECT id, parent_song_id, child_song_id, owner_id, split_percentage, 0 AS depth
  FROM ownership_relations
  WHERE parent_song_id IS NULL AND child_song_id = :song_id
  
  UNION ALL
  
  -- Recursive case: children
  SELECT or.id, or.parent_song_id, or.child_song_id, or.owner_id, or.split_percentage, ot.depth + 1
  FROM ownership_relations or
  INNER JOIN ownership_tree ot ON or.parent_song_id = ot.child_song_id
  WHERE ot.depth < 10  -- max depth limit
)
SELECT * FROM ownership_tree;
```

### Visual Graph API

Frontend nhận JSON graph data để render với D3.js:

```json
{
  "nodes": [
    { "id": "song_A", "title": "Original Track", "owner": "Creator X", "type": "original" },
    { "id": "song_B", "title": "Dark Phonk Remix", "owner": "Remixer Y", "type": "remix" }
  ],
  "edges": [
    { "from": "song_A", "to": "song_B", "split": 70, "type": "remix" }
  ]
}
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| GET | `/ownership/:songId/graph` | Public | Lấy ownership tree JSON |
| GET | `/ownership/:songId/ancestors` | Public | Lấy all ancestors |
| GET | `/ownership/:songId/descendants` | Public | Lấy all children/remixes |
| POST | `/ownership/:songId/claim` | Admin | Manual ownership claim (dispute) |
| GET | `/ownership/user/:userId` | User | Tất cả songs user sở hữu |

## Edge Cases

| Case | Handling |
|------|---------|
| Circular reference | Graph traversal có depth limit (max 10) |
| Owner xóa account | Mark as "deleted user", split không thay đổi |
| Disputed ownership | Freeze royalty, admin review |
| Multi-owner original | Cho phép multiple owners với % khác nhau |
| Split không đủ 100% | Validate tổng = 100% trước khi save |

## Acceptance Criteria

- [ ] Ownership record tạo tự động khi song published
- [ ] Ownership record tạo tự động khi remix published
- [ ] Graph traverse đúng đến N levels
- [ ] Visual graph hiển thị đúng parent-child
- [ ] Royalty calculation dùng đúng split % từ graph
- [ ] Max depth = 10 levels
- [ ] Ownership records KHÔNG thể update sau khi tạo (immutable)

## Related

- [[Business-Rules]]
- [[SRS-Royalty-Engine]]
- [[SRS-AI-Remix-Engine]]
- [[Flow-AI-Remix]]
- [[Flow-Royalty-Split]]
- [[Table-Ownership-Relations]]
- [[API-Ownership]]
