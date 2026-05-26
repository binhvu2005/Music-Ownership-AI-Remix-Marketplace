# API — Music Upload

> 🚧 TODO: Sẽ viết khi implement Music Upload Service

## Endpoints (Planned)

| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| `POST` | `/music/songs` | ✅ JWT (Creator) | Upload bài nhạc mới |
| `GET` | `/music/songs` | ❌ Public | Danh sách bài nhạc |
| `GET` | `/music/songs/:id` | ❌ Public | Chi tiết bài nhạc |
| `PATCH` | `/music/songs/:id` | ✅ JWT (Owner) | Cập nhật metadata |
| `DELETE` | `/music/songs/:id` | ✅ JWT (Owner/Admin) | Xóa bài nhạc |

## Related
- [[SRS-Music-Upload]]
- [[Table-Songs]]
