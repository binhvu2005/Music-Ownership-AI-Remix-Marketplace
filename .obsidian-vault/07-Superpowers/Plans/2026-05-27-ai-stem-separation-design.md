---
title: Design Spec - AI Stem Separation, BullMQ & WebSockets
date: 2026-05-27
status: Approved
tags: [spec, ai, backend, bullmq, websocket, nextjs]
---

# Design Spec: AI Stem Separation & BullMQ Integration (Sprint 3)

## 1. Goal
Tích hợp thành công mô hình AI (Demucs/Spleeter) vào FastAPI `ai-service` để tự động bóc tách các file audio thành 4 stems (Vocals, Drums, Bass, Other) và upload ngược lại lên R2.
Thiết lập hàng đợi 2 chiều (Bidirectional Queue) bằng BullMQ giữa NestJS (Music Service) và FastAPI (AI Service) để xử lý bất đồng bộ, kết hợp WebSocket thời gian thực (real-time) cập nhật tiến độ bóc tách tới Frontend Next.js.

## 2. Architecture & Data Flow

Hệ thống sử dụng cơ chế **Bidirectional Queue (Hàng đợi 2 chiều)** và **WebSockets**:

```text
[Next.js Frontend] --(HTTP Upload R2)--> [Cloudflare R2]
       |
       +--(1. Complete Upload HTTP)--> [NestJS Backend] --(2. Add Job: audio-analysis)--> [Redis Queue]
                                                                                                  |
[Next.js Frontend] <--(5. WS: status-updated)--- [NestJS Backend] <--(4. Add Job: analysis-completed)--- [FastAPI AI Worker]
```

### Bước 1: Khởi động Task & Enqueue
- NestJS nhận tín hiệu Upload Complete từ Frontend Next.js.
- NestJS tạo Job vào queue `audio-analysis` mang theo Payload: `{ songId, fileUrl }` (trong đó `fileUrl` là R2 key).
- NestJS cập nhật trạng thái bài nhạc trong DB thành `queued`.

### Bước 2: AI Processing (FastAPI Worker)
- FastAPI Worker (sử dụng thư viện `bullmq` Python) lắng nghe queue `audio-analysis`.
- Tác vụ xử lý bóc tách được chạy bất đồng bộ bằng `asyncio.to_thread` để tránh block Event Loop chính của FastAPI.
- Worker tải file gốc từ Cloudflare R2 về thư mục temp.
- Thực thi bóc tách Stems bằng **Bộ tách 3 cấp (Fallback Pipeline)**:
  - **Cấp 1**: Dùng mô hình `demucs` (chất lượng cao nhất).
  - **Cấp 2 (Fallback)**: Nếu Demucs lỗi (OOM, CUDA error...), tự động chuyển sang dùng `spleeter`.
  - **Cấp 3 (Fallback)**: Nếu Spleeter vẫn lỗi, chuyển sang **Mock Separator** (sao chép file gốc thành 4 file stem giả lập) để đảm bảo pipeline luôn thông suốt ở local.
- Upload 4 file stems (`vocal.wav`, `drums.wav`, `bass.wav`, `other.wav`) lên R2 dưới key: `songs/<songId>/stems/<stem_type>.wav`.

### Bước 3: Gửi kết quả & Cập nhật DB
- FastAPI đẩy Job kết quả vào queue `analysis-completed` với Payload:
  ```json
  {
    "songId": "uuid-here",
    "status": "success",
    "bpm": 120.0,
    "key": "C",
    "duration": 180,
    "waveform": [0.1, 0.2, ...],
    "stems": {
      "vocal": "songs/<songId>/stems/vocal.wav",
      "drums": "songs/<songId>/stems/drums.wav",
      "bass": "songs/<songId>/stems/bass.wav",
      "other": "songs/<songId>/stems/other.wav"
    }
  }
  ```
- NestJS `AnalysisCompletedProcessor` lắng nghe và xử lý:
  - Cập nhật bảng `Song` (BPM, Key, Duration, `processingStatus = 'done'`).
  - Upsert dữ liệu vào bảng `SongAnalysis` (BPM, Key, Duration, Waveform JSON).
  - Tạo mới các bản ghi trong bảng `Stem` liên kết với `Song`.
  - Nếu thất bại, chuyển trạng thái `Song` thành `failed`.

### Bước 4: WebSocket Real-time Update
- NestJS kích hoạt `MusicGateway` phát sự kiện tới room của bài hát: `song:<songId>`.
- Sự kiện tên là `song:status-updated` mang theo payload chi tiết bài hát mới nhất.
- Client Next.js đang đăng ký lắng nghe room này sẽ nhận được dữ liệu và cập nhật giao diện (hiển thị waveform và các thanh mixer điều khiển stem) lập tức mà không cần F5.

---

## 3. Libraries & Dependencies

- **FastAPI**: `bullmq` (Python), `demucs`, `spleeter`, `boto3`.
- **NestJS**: `@nestjs/bullmq`, `bullmq`, `@nestjs/websockets`, `@nestjs/platform-socket.io`.
- **Next.js**: `socket.io-client`.

---

## 4. Error Handling & Fallbacks
- **AI Out Of Memory / CPU Crash**: Bọc khối `try-except` xung quanh trình bóc tách Demucs để kích hoạt Spleeter. Nếu Spleeter tiếp tục lỗi thì chạy Mock Separator.
- **R2 Upload Failures**: Retry tự động trên BullMQ nếu xảy ra sự cố mạng trong quá trình upload file kết quả lên Cloudflare R2.
- **WebSocket Reconnection**: Phía client Next.js cấu hình tự động kết nối lại (auto-reconnect) nếu bị mất mạng hoặc reload server backend.
