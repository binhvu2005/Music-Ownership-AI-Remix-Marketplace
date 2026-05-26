---
title: Database Design — StemVerse
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - database
  - schema
---

# Database Design — StemVerse

## ERD Overview

```
users
  ├── oauth_accounts (1:N)
  ├── songs (1:N) [as owner]
  ├── user_licenses (1:N) [as buyer]
  ├── user_wallets (1:1)
  └── follows (N:M via follows table)

songs
  ├── stems (1:N)
  ├── song_analysis (1:1)
  ├── song_license_configs (1:1)
  ├── ownership_relations (as parent OR child)
  ├── remix_jobs (1:N)
  ├── remixes (1:N as parent)
  ├── marketplace_assets (1:N)
  ├── likes (1:N)
  └── comments (1:N)

ownership_relations
  └── connects: parent_song → child_song → owner → split_%

royalty_transactions
  ├── → users (N:1)
  └── → songs (N:1)
```

## Core Tables

### users
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255)
role          VARCHAR(20) DEFAULT 'consumer'
  -- CHECK role IN ('creator','remixer','consumer','admin')
display_name  VARCHAR(100)
avatar_url    TEXT
bio           TEXT
is_verified   BOOLEAN DEFAULT false
is_banned     BOOLEAN DEFAULT false
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

### songs
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
title           VARCHAR(255) NOT NULL
genre           VARCHAR(50)
bpm             DECIMAL(6,2)
key             VARCHAR(10)
mood            VARCHAR(50)
tags            TEXT[]
lyrics          TEXT
instruments     TEXT[]
vocal_type      VARCHAR(50)
file_url        TEXT NOT NULL
duration        INTEGER    -- seconds
license_type    VARCHAR(20) DEFAULT 'personal'
remix_allowed   BOOLEAN DEFAULT true
commercial_allowed BOOLEAN DEFAULT false
ai_voice_cloning_allowed BOOLEAN DEFAULT false
royalty_split_remixer   DECIMAL(5,2) DEFAULT 20.00
royalty_split_platform  DECIMAL(5,2) DEFAULT 10.00
processing_status VARCHAR(20) DEFAULT 'queued'
  -- queued | processing | done | failed
is_published    BOOLEAN DEFAULT false
total_streams   INTEGER DEFAULT 0
total_remixes   INTEGER DEFAULT 0
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()

INDEX ON owner_id
INDEX ON genre
INDEX ON bpm
INDEX ON is_published
```

### ownership_relations
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
parent_song_id    UUID REFERENCES songs(id) NULL
  -- NULL = original song (no parent)
child_song_id     UUID NOT NULL REFERENCES songs(id)
owner_id          UUID NOT NULL REFERENCES users(id)
split_percentage  DECIMAL(5,2) NOT NULL
  -- CHECK split_percentage >= 0 AND split_percentage <= 100
relationship_type VARCHAR(20) DEFAULT 'remix'
  -- original | remix | cover | sample
license_rules     JSONB DEFAULT '{}'
created_at        TIMESTAMPTZ DEFAULT NOW()
  -- IMMUTABLE: never UPDATE this table

INDEX ON parent_song_id
INDEX ON child_song_id
INDEX ON owner_id
```

### royalty_transactions
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID NOT NULL REFERENCES users(id)
song_id       UUID NOT NULL REFERENCES songs(id)
event_type    VARCHAR(30) NOT NULL
  -- stream | license_purchase | marketplace_sale | subscription_pool
event_id      UUID NOT NULL
role          VARCHAR(30) NOT NULL
  -- original_creator | remixer | platform
gross_amount  INTEGER NOT NULL    -- cents
platform_fee  INTEGER NOT NULL    -- cents
net_amount    INTEGER NOT NULL    -- cents
currency      VARCHAR(3) DEFAULT 'USD'
status        VARCHAR(20) DEFAULT 'credited'
  -- pending | credited | paid
created_at    TIMESTAMPTZ DEFAULT NOW()

INDEX ON user_id
INDEX ON song_id
INDEX ON event_id
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Tables | snake_case, plural | `user_licenses` |
| Columns | snake_case | `created_at` |
| Primary Key | `id` (UUID) | `id UUID` |
| Foreign Keys | `{table_singular}_id` | `song_id` |
| Enum strings | lowercase hyphenated | `'license_purchase'` |
| Timestamps | `created_at`, `updated_at`, `TIMESTAMPTZ` | |
| Boolean | `is_` prefix | `is_published` |
| Amounts | Integer cents | `2999` = $29.99 |

## Migration Strategy

```
Tool: Prisma Migrate
Files: prisma/migrations/
Naming: YYYYMMDDHHMMSS_description
Process:
  1. Edit prisma/schema.prisma
  2. npx prisma migrate dev --name <description>
  3. Commit migration file
```

## Related

- [[ERD]]
- [[Table-Users]]
- [[Table-Songs]]
- [[Table-Stems]]
- [[Table-Remixes]]
- [[Table-Ownership-Relations]]
- [[Table-Licenses]]
- [[Table-Royalty-Transactions]]
- [[ADR-004-PostgreSQL-Database]]
