# 📋 Superpowers — Specs

> Spec chi tiết cho từng feature trước khi viết plan.
> Flow: Brainstorming → **Spec** → Plan → Code

## Template

```markdown
## [Feature Name] — Specification
**Ngày:** YYYY-MM-DD
**SRS Reference:** [[SRS-xxx]]
**Actors:** Creator / Remixer / Consumer / Admin
**Input:** ...
**Output:** ...
**Business Rules:** ...
**Edge Cases:** ...
**Acceptance Criteria:**
- [ ] AC1: ...
- [ ] AC2: ...
```

## Specs

- [[Music-Upload-Spec]]: Chi tiết quy trình khởi tạo bài hát và Presigned URL.
- [[AI-Stem-Separation-Spec]]: Xử lý Background Job với BullMQ và Python FastAPI.
- [[Payment-System-Spec]]: Chi tiết API tạo Payment Intent và xử lý Webhook Stripe để cấp License.
