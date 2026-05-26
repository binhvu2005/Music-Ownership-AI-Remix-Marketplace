---
title: Table — Ownership Relations
author: Solo Developer
created: 2026-05-26
status: Approved
tags: [database, table, ownership, critical]
---

# Table — Ownership Relations

> [!CAUTION]
> This table is **IMMUTABLE**. Records are NEVER updated or deleted after creation. This is a business and legal invariant. Any migration that adds UPDATE/DELETE operations on this table must be rejected.

## Schema

```sql
CREATE TABLE ownership_relations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_song_id    UUID REFERENCES songs(id) NULL,  -- NULL = original (no parent)
  child_song_id     UUID NOT NULL REFERENCES songs(id),
  owner_id          UUID NOT NULL REFERENCES users(id),
  split_percentage  DECIMAL(5,2) NOT NULL,
  relationship_type VARCHAR(20) NOT NULL DEFAULT 'remix',
  license_rules     JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- NO updated_at — IMMUTABLE
);

-- Indexes
CREATE INDEX idx_ownership_parent ON ownership_relations(parent_song_id);
CREATE INDEX idx_ownership_child ON ownership_relations(child_song_id);
CREATE INDEX idx_ownership_owner ON ownership_relations(owner_id);

-- Constraints
ALTER TABLE ownership_relations ADD CONSTRAINT chk_split 
  CHECK (split_percentage >= 0 AND split_percentage <= 100);
ALTER TABLE ownership_relations ADD CONSTRAINT chk_relationship_type 
  CHECK (relationship_type IN ('original', 'remix', 'cover', 'sample'));

-- Prevent self-reference
ALTER TABLE ownership_relations ADD CONSTRAINT chk_no_self_ref
  CHECK (parent_song_id != child_song_id);
```

## Prisma Schema

```prisma
model OwnershipRelation {
  id               String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  parentSongId     String?  @db.Uuid  -- null for original tracks
  childSongId      String   @db.Uuid
  ownerId          String   @db.Uuid
  splitPercentage  Decimal  @db.Decimal(5, 2)
  relationshipType String   @default("remix") @db.VarChar(20)
  licenseRules     Json     @default("{}")
  createdAt        DateTime @default(now()) @db.Timestamptz

  parentSong Song? @relation("ParentSong", fields: [parentSongId], references: [id])
  childSong  Song  @relation("ChildSong", fields: [childSongId], references: [id])
  owner      User  @relation(fields: [ownerId], references: [id])

  @@index([parentSongId])
  @@index([childSongId])
  @@index([ownerId])
  @@map("ownership_relations")
}
```

## Data Examples

### Original Track Upload

```json
{
  "id": "uuid-1",
  "parent_song_id": null,
  "child_song_id": "song-A-id",
  "owner_id": "creator-X-id",
  "split_percentage": 90.00,
  "relationship_type": "original",
  "license_rules": { "commercial": true, "remix": true }
}
```

### Remix of Original

```json
{
  "id": "uuid-2",
  "parent_song_id": "song-A-id",
  "child_song_id": "remix-B-id",
  "owner_id": "creator-X-id",
  "split_percentage": 70.00,
  "relationship_type": "remix",
  "license_rules": {}
},
{
  "id": "uuid-3",
  "parent_song_id": "song-A-id",
  "child_song_id": "remix-B-id",
  "owner_id": "remixer-Y-id",
  "split_percentage": 20.00,
  "relationship_type": "remix",
  "license_rules": {}
}
```

## Graph Traversal Query

```sql
-- Get full ownership tree for a song
WITH RECURSIVE ownership_tree AS (
  -- Seed: find direct ownership of target song
  SELECT id, parent_song_id, child_song_id, owner_id, split_percentage, 0 AS depth
  FROM ownership_relations
  WHERE child_song_id = $1
  
  UNION ALL
  
  -- Recurse: find parents
  SELECT or2.id, or2.parent_song_id, or2.child_song_id, or2.owner_id, or2.split_percentage, ot.depth + 1
  FROM ownership_relations or2
  INNER JOIN ownership_tree ot ON ot.parent_song_id = or2.child_song_id
  WHERE ot.depth < 10  -- max depth protection
)
SELECT * FROM ownership_tree ORDER BY depth;
```

## Related

- [[ERD]]
- [[SRS-Ownership-Graph]]
- [[SRS-Royalty-Engine]]
- [[Table-Songs]]
- [[ADR-004-PostgreSQL-Database]]
