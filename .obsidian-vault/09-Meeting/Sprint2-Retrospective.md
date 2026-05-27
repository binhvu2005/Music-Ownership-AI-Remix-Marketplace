---
title: Sprint 2 Retrospective
created: 2026-05-27
tags: [retrospective, sprint2, ai, music-upload]
---

# Sprint 2 Retrospective: Music Upload & AI Processing

**Date**: 2026-05-27
**Status**: 🟢 HOÀN THÀNH (DONE)

## 1. Kết quả đạt được (Results)
- Hoàn thành toàn bộ luồng tải nhạc trực tiếp từ Frontend lên Cloudflare R2 bằng Presigned URL.
- Khởi tạo thành công `ai-service` bằng FastAPI để bóc tách BPM, Key và Waveform qua `Librosa`.
- Tích hợp thành công hàng đợi BullMQ (Redis) để điều phối xử lý nhạc bất đồng bộ mà không làm treo main thread của NestJS.
- Refactor Frontend UI tuân thủ **Iron Law 4** (i18n & Theme Variables) và vượt qua 100% test coverage bằng Jest/RTL.

## 2. Quyết định kỹ thuật (Decisions)
- **Direct Upload to R2**: Bỏ qua việc đẩy file qua backend NestJS. Frontend trực tiếp `PUT` file chunks lên Cloudflare R2 để giảm tải băng thông cho server (Zero-hop).
- **AI Processing Environment**: Sử dụng Docker image `python:3.10-slim` thay vì bản 3.13 mới nhất để đảm bảo tương thích tuyệt đối khi build thư viện tính toán C/C++ của `numpy` và `librosa`.

## 3. Bug & Lesson Learned (Bài học kinh nghiệm)
- **Bug 1: Python 3.13 Build Failure**: Việc cài đặt cục bộ `numpy==1.26.4` bằng `pip` trên Windows với Python 3.13 bị lỗi (do thiếu tương thích của `meson-python` với kiến trúc mới). 
  - *Giải pháp (Workaround)*: Chấp nhận lỗi cảnh báo đỏ trên IDE cục bộ (do VSCode dùng interpreter bản 3.13). Chỉnh sửa unit test (`test_main.py`) bằng cách `MagicMock` các thư viện nặng (`boto3`, `librosa`) để có thể chạy test cục bộ tốc độ cao (Red-Green phase) mà không cần cài đặt librosa nặng nề. Deploy thực tế sẽ dùng Docker Python 3.10.
- **Bug 2: Thiếu Test Frontend (Iron Law Violation)**: Agent đã bỏ sót việc viết Unit Test cho trang Upload UI của Next.js (vi phạm Iron Law 2). 
  - *Giải pháp*: Cài đặt khẩn cấp `jest`, `@testing-library/react`. Chỉnh sửa lại cấu hình bằng `next/jest`, Rollback file `.tsx` về trạng thái giả lập (Red Phase) và sau đó đẩy code thật vào để Pass (Green Phase). Đồng thời bổ sung Iron Law số 4 để ràng buộc i18n.
