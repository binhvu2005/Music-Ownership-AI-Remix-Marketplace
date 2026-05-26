---
title: ADR-002 — Use NestJS for Backend Services
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, backend, nestjs]
---

# ADR-002 — Use NestJS for Backend Services

## Status: Accepted ✅

## Context

Cần backend framework cho microservices. Yêu cầu:
- TypeScript native
- Dependency injection (testable)
- Module system (scalable)
- Queue support
- WebSocket support

## Decision

Dùng **NestJS** cho tất cả TypeScript backend services.

## Reasons

| Reason | Detail |
|--------|-------|
| TypeScript native | Full type safety |
| Dependency Injection | Testable services |
| Module system | Clean microservice structure |
| BullMQ integration | @nestjs/bull |
| WebSocket | @nestjs/websockets |
| Guards/Interceptors | Built-in auth patterns |

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| Express.js | No structure, too bare |
| Fastify | Less ecosystem than NestJS |
| Hono | Too new, less docs |

## Consequences

- ✅ Consistent pattern across all services
- ✅ Excellent testing support (NestJS testing module)
- ✅ Decorator-based = clean code
- ⚠️ More boilerplate than Express
- ⚠️ Slower startup time (DI container)

## Related

- [[Backend-Architecture]]
- [[Microservice-Map]]
