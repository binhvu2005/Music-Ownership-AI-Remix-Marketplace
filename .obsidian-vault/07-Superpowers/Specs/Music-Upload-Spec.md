## Music Upload Service — Specification
**Ngày:** 2026-05-27
**SRS Reference:** [[SRS-Music-Upload]]
**Actors:** Creator
**Input:** File âm thanh (MP3, WAV, FLAC), Metadata (Title, Genre, BPM, Key)
**Output:** File được upload thành công lên R2 (S3), Bản ghi Song trong Database (PostgreSQL)
**Business Rules:**
- Hệ thống tạo Presigned URL để client (Frontend Next.js) trực tiếp upload lên R2 (tránh nghẽn server Backend).
- Sau khi có thông báo Upload Complete từ Client, Backend tiến hành khởi tạo Song Entity ở trạng thái DRAFT.
- Đẩy một Job vào hàng đợi `audio-analysis` để tiến hành tách Stem tự động.
**Edge Cases:**
- File quá dung lượng (trên 500MB) -> Trả về lỗi 400.
- Lỗi mạng giữa chừng khi client upload lên S3 -> Upload session bị hủy hoặc resume.
**Acceptance Criteria:**
- [x] AC1: Giao thức khởi tạo Presigned URL hoạt động mượt mà.
- [x] AC2: Ghi danh bài hát vào DB và khởi tạo Background Job sau khi lưu thành công.
- [x] AC3: Tích hợp thành công với Cloudflare R2 (S3 protocol).
