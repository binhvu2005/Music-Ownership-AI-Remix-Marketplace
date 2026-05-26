---
title: ADR-006 — Use Cloudflare R2 for Object Storage
status: Accepted
date: 2026-05-26
deciders: Solo Developer
tags: [adr, storage, cloudflare, r2]
---

# ADR-006 — Use Cloudflare R2 for Object Storage

## Status: Accepted ✅

## Context

StemVerse cần lưu trữ: audio files (MP3, WAV), stems, waveform data, previews. Volume estimate: 1TB+ trong năm đầu.

## Decision

Dùng **Cloudflare R2** làm primary object storage.

## Reasons

| Reason | Detail |
|--------|-------|
| **Zero egress fees** | Không tốn phí bandwidth (S3 tốn rất nhiều) |
| S3-compatible API | Dùng @aws-sdk/client-s3 |
| Global CDN | Cloudflare network (200+ PoPs) |
| Presigned URLs | Direct upload/download từ client |
| Price | $0.015/GB/month (S3: $0.023/GB) |

## Storage Buckets

| Bucket | Content | Access |
|--------|---------|--------|
| `stemverse-audio` | Original files | Private (signed URL) |
| `stemverse-stems` | Separated stems | Private (signed URL) |
| `stemverse-preview` | 30s preview clips | Public CDN |
| `stemverse-waveform` | Waveform PNG/JSON | Public CDN |

## Upload Strategy

```
Client ──► API: "I want to upload this file"
API ──► R2: Generate presigned URL (1 hour)
API ──► Client: { uploadUrl, fileKey }
Client ──► R2: PUT file directly (bypass API)
Client ──► API: "Upload complete, key: {fileKey}"
```

## Alternatives Considered

| Alternative | Why Rejected |
|-----------|-------------|
| AWS S3 | Egress fees rất cao (audio = nhiều bandwidth) |
| Google Cloud Storage | Phức tạp hơn, vẫn có egress fees |
| Backblaze B2 | Tốt nhưng CDN kém hơn Cloudflare |
| Self-hosted (MinIO) | Ops burden quá lớn cho solo dev |

## Consequences

- ✅ Zero egress = không surprise bill
- ✅ S3-compatible API = dễ migrate sang S3 nếu cần
- ✅ CDN global = fast audio delivery
- ⚠️ Cloudflare R2 vẫn còn khá mới (ít docs)
- ⚠️ Cần Cloudflare account + domain setup

## Related

- [[System-Architecture]]
- [[SRS-Music-Upload]]
