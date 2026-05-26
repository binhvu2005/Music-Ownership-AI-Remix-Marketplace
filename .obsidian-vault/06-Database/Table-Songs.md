---
title: Table — Songs
author: Solo Developer
created: 2026-05-26
status: Approved
tags: [database, table, songs]
---

# Table — Songs

## Schema

```sql
CREATE TABLE songs (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title                   VARCHAR(255) NOT NULL,
  genre                   VARCHAR(50),
  bpm                     DECIMAL(6,2),
  key                     VARCHAR(10),    -- e.g., "C#m", "F major"
  mood                    VARCHAR(50),
  tags                    TEXT[],
  lyrics                  TEXT,
  instruments             TEXT[],
  vocal_type              VARCHAR(50),
  file_url                TEXT NOT NULL,
  duration                INTEGER,        -- seconds
  license_type            VARCHAR(20) NOT NULL DEFAULT 'personal',
  remix_allowed           BOOLEAN NOT NULL DEFAULT true,
  commercial_allowed      BOOLEAN NOT NULL DEFAULT false,
  ai_voice_cloning_allowed BOOLEAN NOT NULL DEFAULT false,
  royalty_split_remixer   DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  royalty_split_platform  DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  processing_status       VARCHAR(20) NOT NULL DEFAULT 'queued',
  is_published            BOOLEAN NOT NULL DEFAULT false,
  total_streams           INTEGER NOT NULL DEFAULT 0,
  total_remixes           INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_songs_owner_id ON songs(owner_id);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_is_published ON songs(is_published);
CREATE INDEX idx_songs_remix_allowed ON songs(remix_allowed) WHERE remix_allowed = true;

-- Constraints
ALTER TABLE songs ADD CONSTRAINT chk_bpm CHECK (bpm IS NULL OR (bpm >= 1 AND bpm <= 300));
ALTER TABLE songs ADD CONSTRAINT chk_royalty_split 
  CHECK (royalty_split_remixer + royalty_split_platform <= 100);
ALTER TABLE songs ADD CONSTRAINT chk_license_type 
  CHECK (license_type IN ('personal', 'commercial', 'remix', 'exclusive'));
ALTER TABLE songs ADD CONSTRAINT chk_processing_status 
  CHECK (processing_status IN ('queued', 'processing', 'done', 'failed'));
```

## Prisma Schema

```prisma
model Song {
  id                    String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  ownerId               String   @db.Uuid
  title                 String   @db.VarChar(255)
  genre                 String?  @db.VarChar(50)
  bpm                   Decimal? @db.Decimal(6, 2)
  key                   String?  @db.VarChar(10)
  mood                  String?  @db.VarChar(50)
  tags                  String[]
  lyrics                String?
  instruments           String[]
  vocalType             String?  @db.VarChar(50)
  fileUrl               String
  duration              Int?
  licenseType           String   @default("personal") @db.VarChar(20)
  remixAllowed          Boolean  @default(true)
  commercialAllowed     Boolean  @default(false)
  aiVoiceCloningAllowed Boolean  @default(false)
  royaltySplitRemixer   Decimal  @default(20.00) @db.Decimal(5, 2)
  royaltySplitPlatform  Decimal  @default(10.00) @db.Decimal(5, 2)
  processingStatus      String   @default("queued") @db.VarChar(20)
  isPublished           Boolean  @default(false)
  totalStreams           Int      @default(0)
  totalRemixes          Int      @default(0)
  createdAt             DateTime @default(now()) @db.Timestamptz
  updatedAt             DateTime @updatedAt @db.Timestamptz

  owner              User               @relation(fields: [ownerId], references: [id])
  stems              Stem[]
  analysis           SongAnalysis?
  licenseConfig      SongLicenseConfig?
  ownershipAsParent  OwnershipRelation[] @relation("ParentSong")
  ownershipAsChild   OwnershipRelation[] @relation("ChildSong")
  userLicenses       UserLicense[]
  royaltyTxs         RoyaltyTransaction[]
  remixJobs          RemixJob[]
  likes              Like[]
  comments           Comment[]

  @@index([ownerId])
  @@index([genre])
  @@index([isPublished])
  @@map("songs")
}
```

## Column Notes

| Column | Note |
|--------|------|
| `bpm` | Range: 1–300. Detect by AI, editable by creator |
| `key` | E.g., "C#m", "F major". AI-detected |
| `royalty_split_remixer` | % that goes to remixer. Default 20% |
| `royalty_split_platform` | Always 10%. Creator gets remainder |
| `processing_status` | Set by AI analysis pipeline |
| `is_published` | false until creator clicks "Publish" |

## Related

- [[ERD]]
- [[Table-Stems]]
- [[SRS-Music-Upload]]
- [[API-Music]]
