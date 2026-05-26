---
title: SRS — Realtime Collaboration
type: spec
project: StemVerse
module: realtime-collab
status: Draft
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - realtime
  - websocket
  - phase2
---

# SRS — Realtime Collaboration (Phase 2)

> [!NOTE]
> Module này thuộc **MVP Phase 2**.

## Problem

Remixers muốn remix cùng nhau theo thời gian thực như Google Docs nhưng cho âm nhạc.

## Goal

Xây dựng Realtime Collaboration:
- Nhiều user remix cùng một track cùng lúc
- Live cursor presence
- Live waveform sync
- Real-time audio preview

## Technical Design

### WebSocket Events

```typescript
// Server → Client
"presence:update"     // ai đang online, cursor position
"waveform:update"     // ai sửa waveform
"stem:update"         // ai thay đổi stem
"remix:chat"          // chat message

// Client → Server
"remix:join"          // join collab session
"remix:leave"         // leave
"stem:change"         // user sửa stem
"cursor:move"         // cursor position
```

### Technologies

| Layer | Tech |
|-------|------|
| WebSocket | Socket.IO |
| Presence | Redis Pub/Sub |
| State sync | Operational Transform (OT) / CRDT |

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/collab/sessions` | User | Tạo collab session |
| GET | `/collab/sessions/:id` | User | Join session |
| WS | `/collab/ws/:sessionId` | User | WebSocket connection |

## Acceptance Criteria

- [ ] 2+ users có thể join cùng session
- [ ] Cursor presence visible cho tất cả participants
- [ ] Stem changes sync trong <100ms
- [ ] Conflict resolution khi 2 users edit cùng lúc
- [ ] Auto-save session state

## Related

- [[SRS-AI-Remix-Engine]]
- [[MVP-Phase2]]
