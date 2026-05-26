---
title: ERD — StemVerse
author: Solo Developer
created: 2026-05-26
status: Approved
tags: [database, erd, schema]
---

# ERD — StemVerse Entity Relationship Diagram

## Core Entities

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│  id | email | role | display_name | is_verified | ...       │
└──────────────────┬──────────────────────────────────────────┘
                   │ 1:N (owner)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                        SONGS                                 │
│  id | owner_id | title | bpm | key | license_type | ...     │
└────┬──────────────────┬──────────────────────────────────────┘
     │                  │
     │ 1:N              │ 1:1
     ▼                  ▼
┌──────────┐    ┌──────────────────┐
│  STEMS   │    │  SONG_ANALYSIS   │
│ id|song_id│    │ id|song_id|bpm  │
│ type|url │    │ key|waveform|..  │
└──────────┘    └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   OWNERSHIP_RELATIONS                        │
│  id | parent_song_id (NULL=original) | child_song_id        │
│  owner_id | split_percentage | relationship_type            │
│  (IMMUTABLE — never UPDATE)                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      USER_LICENSES                           │
│  id | user_id | song_id | license_type | price_paid         │
│  license_key | expires_at                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  ROYALTY_TRANSACTIONS                        │
│  id | user_id | song_id | event_type | role                  │
│  gross_amount | platform_fee | net_amount | status           │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌─────────────────────────────────┐
│    USER_WALLETS      │    │           PAYOUTS               │
│  id | user_id        │    │  id | user_id | amount | method  │
│  balance_usd         │    │  status | external_id           │
│  total_earned        │    └─────────────────────────────────┘
└──────────────────────┘
```

## Relationships Summary

| From | To | Type | Via |
|------|----|------|-----|
| users | songs | 1:N | songs.owner_id |
| users | oauth_accounts | 1:N | oauth_accounts.user_id |
| users | user_licenses | 1:N | user_licenses.user_id |
| users | user_wallets | 1:1 | user_wallets.user_id |
| songs | stems | 1:N | stems.song_id |
| songs | song_analysis | 1:1 | song_analysis.song_id |
| songs | ownership_relations | N:M | ownership_relations (as parent + child) |
| songs | user_licenses | 1:N | user_licenses.song_id |
| songs | royalty_transactions | 1:N | royalty_transactions.song_id |
| users | follows | N:M | follows table |
| songs | likes | N:M | likes table |
| songs | comments | 1:N | comments.song_id |

## Tables Index

- [[Table-Users]]
- [[Table-Songs]]
- [[Table-Stems]]
- [[Table-Remixes]]
- [[Table-Ownership-Relations]]
- [[Table-Licenses]]
- [[Table-Royalty-Transactions]]

## Related

- [[Database-Design]]
- [[ADR-004-PostgreSQL-Database]]
