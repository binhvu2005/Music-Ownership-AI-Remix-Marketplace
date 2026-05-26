---
title: ADR-005 — Use Redis for Cache and Queue
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, redis, queue, cache]
---

# ADR-005 — Use Redis for Cache and Queue

## Status: Accepted ✅

## Context

Cần:
1. **Cache**: JWT refresh tokens, session data, rate limiting counters
2. **Job Queue**: Audio processing, AI remix jobs, email queue
3. **Pub/Sub**: Royalty events, notification events

## Decision

Dùng **Redis 7** cho cả 3 use cases, với **BullMQ** cho queue management.

## Reasons

| Use Case | Redis Feature |
|---------|-------------|
| Refresh tokens | `SET key value EX 2592000` |
| Rate limiting | `INCR` + `EXPIRE` |
| Job queue | BullMQ (built on Redis) |
| Pub/Sub events | Native Pub/Sub |
| Presence (Phase 2) | Redis Pub/Sub + Sorted Sets |

## Queues

```
audio-analysis      Priority: high   Concurrency: 4 (CPU)
ai-remix            Priority: normal Concurrency: 2 (GPU)
notifications       Priority: normal Concurrency: 10
email               Priority: low    Concurrency: 5
```

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| RabbitMQ | Over-engineered cho scale hiện tại |
| SQS (AWS) | Vendor lock-in, phức tạp |
| PostgreSQL queue | Không phù hợp cho high-throughput |
| BullMQ cloud | Tốn tiền |

## Consequences

- ✅ Đơn giản: 1 service, 3 use cases
- ✅ BullMQ = excellent NestJS integration
- ✅ Pub/Sub = low latency events
- ⚠️ In-memory = data loss khi restart (cần Redis persistence)
- ⚠️ Single point of failure → cần Redis Sentinel/Cluster production

## Production Config

```
maxmemory: 512mb
maxmemory-policy: allkeys-lru
appendonly: yes    # AOF persistence
```

## Related

- [[System-Architecture]]
- [[Microservice-Map]]
- [[AI-Pipeline]]
