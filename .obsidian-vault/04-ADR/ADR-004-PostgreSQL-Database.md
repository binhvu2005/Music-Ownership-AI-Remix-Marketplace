---
title: ADR-004 — Use PostgreSQL as Primary Database
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags:
  - adr
  - database
  - postgresql
---

# ADR-004 — Use PostgreSQL as Primary Database

## Status: Accepted ✅

## Context

StemVerse cần database lưu: users, songs, ownership relations, royalty transactions. Ownership graph đặc biệt cần recursive queries (CTE).

## Decision

Dùng **PostgreSQL 16** với **Prisma ORM**.

## Reasons

| Reason | Detail |
|--------|-------|
| JSONB support | License rules, ownership config |
| Recursive CTE | Ownership graph traversal |
| UUID support | `gen_random_uuid()` |
| ACID transactions | Royalty calculation atomic |
| Array support | `TEXT[]` cho tags, instruments |
| Mature ecosystem | Best Prisma support |

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| MySQL | Kém flexible, ít feature |
| MongoDB | Document DB không phù hợp graph relations |
| SQLite | Không scale |
| PlanetScale | MySQL-based, no CTEs |

## Graph Queries Strategy

Ownership graph dùng **Adjacency List** + **Recursive CTE**:

```sql
WITH RECURSIVE tree AS (
  SELECT * FROM ownership_relations WHERE parent_song_id = :id
  UNION ALL
  SELECT or.* FROM ownership_relations or
  INNER JOIN tree ON or.parent_song_id = tree.child_song_id
)
SELECT * FROM tree;
```

## Consequences

- ✅ Full relational integrity
- ✅ Recursive CTE = elegant graph queries
- ✅ Prisma = type-safe queries + migrations
- ⚠️ Graph queries có thể slow ở N=10+ levels → cần index
- ⚠️ Không phải native graph DB (Neo4j thì tốt hơn cho graph)

## Related

- [[Database-Design]]
- [[Table-Ownership-Relations]]
- [[SRS-Ownership-Graph]]
