---
title: SRS — AI Voice System
type: spec
project: StemVerse
module: ai-voice
status: Draft
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - ai-voice
  - phase2
---

# SRS — AI Voice System (Phase 2)

> [!NOTE]
> Module này thuộc **MVP Phase 2**. Không implement trong Phase 1.

## Problem

Creator muốn upload licensed AI voice của mình để người dùng khác sử dụng trong remix. Cần framework pháp lý và kỹ thuật rõ ràng để tránh abuse.

## Goal

Xây dựng AI Voice System:
- Creator upload licensed AI voice model/pack
- Consumer mua quyền dùng voice pack
- Legal: chỉ cho phép consenting artists, không celebrity cloning

## Scope

**In scope:**
- Voice pack upload (creator)
- Voice pack marketplace
- Emotion presets
- Vocal style configuration
- License per voice pack

**STRICTLY OUT OF SCOPE (LEGAL PROHIBITION):**
- ❌ Celebrity voice cloning
- ❌ Unauthorized voice imitation
- ❌ Real person voice without explicit consent

## Technical Design

### Voice Pack Structure

```
voice_pack/
├── model.pt              # PyTorch model
├── config.json           # Voice parameters
├── samples/              # Reference samples (consenting artist)
│   ├── sample_01.wav
│   └── sample_02.wav
└── metadata.json         # pack info, consent proof
```

### Legal Safeguards

1. **Consent Verification**: Creator phải upload consent document
2. **Identity Verification**: Verified account chỉ của chính creator
3. **Content Policy**: Automated scan + human review
4. **Copyright Check**: AI fingerprinting vs known celebrities

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/ai/voice/packs` | Creator | Upload voice pack |
| GET | `/ai/voice/packs` | Public | Browse voice packs |
| GET | `/ai/voice/packs/:id` | Public | Voice pack detail |
| POST | `/ai/voice/apply` | Remixer | Apply voice to track |
| GET | `/ai/voice/apply/:jobId/status` | Remixer | Check status |

## Acceptance Criteria

- [ ] Creator upload voice pack với consent proof
- [ ] Voice pack goes through review process
- [ ] Remixer apply voice pack to track (license required)
- [ ] Celebrity detection blocks unauthorized packs
- [ ] Legal disclaimer required at voice pack creation

## Related

- [[SRS-AI-Remix-Engine]]
- [[Business-Rules]]
- [[MVP-Phase2]]
