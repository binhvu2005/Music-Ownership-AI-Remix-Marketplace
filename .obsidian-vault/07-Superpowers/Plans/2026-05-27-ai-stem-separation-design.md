---
title: Design Spec - AI Stem Separation & Event-Driven Pipeline
date: 2026-05-27
status: Approved
tags: [spec, ai, backend, bullmq]
---

# Design Spec: AI Stem Separation & BullMQ Integration (Sprint 3)

## 1. Goal
Tích hợp thành công mô hình AI (Demucs/Spleeter) vào FastAPI để tự động bóc tách các file audio thành 4 stems (Vocals, Drums, Bass, Other).
Thiết lập kiến trúc Event-Driven hoàn chỉnh (Zero-hop) giữa NestJS (Music Service) và FastAPI (AI Service) thông qua hàng đợi Redis/BullMQ.

## 2. Architecture & Data Flow

Hệ thống sử dụng cơ chế **Bidirectional Queue (Hàng đợi 2 chiều)** để tuân thủ tuyệt đối ranh giới Microservices (Iron Law 3):

```text
[NestJS Backend] ---(Job: audio-analysis)---> [Redis Queue 1]
                                                    |
[NestJS Backend] <---(Job: analysis-result)--- [Redis Queue 2] <--- [FastAPI AI Worker]
```

### Bước 1: Khởi động Task
- NestJS nhận tín hiệu Upload Complete từ Frontend.
- NestJS tạo Job vào `audio-analysis-queue` mang theo Payload: `{ songId, r2_file_key, r2_url }`.

### Bước 2: AI Processing (FastAPI)
- Worker của FastAPI được triển khai qua package Python `bullmq`.
- Nó bắt Job từ Queue 1, tải file từ `r2_url` về `temp/`.
- Thực thi Demucs. Nếu lỗi (như OOM Memory), fallback tự động sang Spleeter.
- Quá trình chạy mất 3-5 phút (CPU Bound).
- Upload 4 file stems (`vocals.wav`, `drums.wav`, `bass.wav`, `other.wav`) ngược lại lên R2.

### Bước 3: Cập nhật Trạng thái (NestJS)
- FastAPI đẩy Job mới vào `analysis-completed-queue` với Payload: 
  `{ songId, status: 'success' | 'failed', stems: { vocals: url, ... } }`
- NestJS Processor lắng nghe Queue 2.
- Cập nhật vào PostgreSQL (Bảng `song_analysis`).
- Emit WebSocket Event tới Frontend.

## 3. Libraries & Tools
- **FastAPI**: `bullmq` (cho Python), `demucs`, `spleeter`, `boto3`.
- **NestJS**: `@nestjs/bullmq`, `bullmq`.

## 4. Error Handling
- **Demucs Crash**: Cấu hình `try-except` bắt lỗi runtime hoặc Memory Error để kích hoạt Spleeter ngay lập tức.
- **Queue Retry**: Cấu hình cơ chế tự động thử lại (Retry) trên BullMQ cho các lỗi do rớt mạng (Network Error khi fetch S3).
- **Graceful Failure**: Nếu mọi fallback đều chết, ghi nhận trạng thái `failed` vào Database để Frontend hiện nút "Thử Lại".
