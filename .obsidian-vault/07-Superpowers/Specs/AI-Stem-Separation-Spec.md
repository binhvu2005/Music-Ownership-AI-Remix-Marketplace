## AI Stem Separation — Specification
**Ngày:** 2026-05-27
**SRS Reference:** [[SRS-Music-Upload]], [[API-AI]]
**Actors:** System Worker
**Input:** Job Data từ Redis Queue chứa `songId` và URL của Audio File gốc.
**Output:** 4 file Stems (Vocals, Drums, Bass, Melody) được tách rời.
**Business Rules:**
- Gửi yêu cầu qua HTTP (FastAPI) để xử lý tách âm bằng thư viện AI (ví dụ: Demucs / Spleeter).
- Cập nhật tiến độ xử lý vào tiến trình Job của BullMQ.
- Sau khi nhận 4 file trả về từ AI Service, upload 4 file này lên R2 (S3).
- Cập nhật Database: Liên kết 4 bản ghi Stem mới vào `songId` tương ứng.
**Edge Cases:**
- AI Service bị sập / Quá tải (Connection Refused) -> Job thất bại, Queue sẽ Retry lại 3 lần.
- File âm thanh không hợp lệ hoặc bị hỏng -> Báo trạng thái ERROR.
**Acceptance Criteria:**
- [x] AC1: Lắng nghe thành công các Job mới được ném vào `audio-analysis` queue.
- [x] AC2: Phân tích file (Mock hoặc gọi FastAPI) và mô phỏng được lỗi mạng để trigger Retry.
- [x] AC3: Ghi nhận 4 stems thành công vào PostgreSQL.
