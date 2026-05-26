Tài liệu sử dụng Obsidian cho dự án phát triển phần mềm
1.1 Mục tiêu
Sử dụng Obsidian để:
-  Quản lý tài liệu kỹ thuật tập trung 
-  Lưu trữ kiến thức dự án 
-  Theo dõi tiến độ công việc 
-  Viết tài liệu họp, SRS, API, guideline 
-  Kết nối thông tin giữa các team 
-  Giảm thất thoát knowledge khi đổi nhân sự 

---
2. Cấu trúc thư mục đề xuất
Project-Knowledge/
│
├── 00-Management/
│   ├── Roadmap.md
│   ├── Timeline.md
│   ├── Risk-Management.md
│   └── Meeting-Minutes/
│
├── 01-Business/
│   ├── Requirement/
│   ├── SRS/
│   ├── User-Story/
│   └── Flow/
│
├── 02-Technical/
│   ├── Architecture/
│   ├── Database/
│   ├── API/
│   ├── DevOps/
│   ├── Security/
│   └── Coding-Convention/
│
├── 03-Frontend/
│   ├── React/
│   ├── React-Native/
│   ├── UI-UX/
│   └── Component/
│
├── 04-Backend/
│   ├── Java/
│   ├── Spring/
│   ├── NodeJS/
│   ├── Microservice/
│   └── Performance/
│
├── 05-QA/
│   ├── Testcase/
│   ├── Bug/
│   └── Regression/
│
├── 06-AI/
│   ├── Prompt/
│   ├── AI-Agent/
│   ├── Meeting-Summary/
│   └── Automation/
│
├── 07-Learning/
│   ├── Research/
│   ├── POC/
│   └── Best-Practice/
│
└── Assets/
    ├── Images/
    ├── Diagrams/
    └── Attachments/

---
3. Quy tắc đặt tên file
Format chuẩn
[Category]-[Title].md
Ví dụ:
API-Authentication.md
DB-User-Table.md
Meeting-2026-05-26.md
Bug-Login-Timeout.md

---
4. Quy tắc viết tài liệu
4.1 Metadata đầu file
---
title: API Authentication
author: Luan Nguyen
created: 2026-05-26
status: Draft
tags:
  - backend
  - api
  - auth
---

---
4.2 Template tài liệu kỹ thuật
# Mục tiêu

# Mô tả

# Kiến trúc

# Flow xử lý

# API

# Database

# Security

# Edge Cases

# TODO

# References

---
5. Linking Knowledge (rất quan trọng)
Sử dụng Wiki Link
[[API-Authentication]]
[[Database-Design]]
[[Meeting-2026-05-26]]
Ví dụ
Luồng login sử dụng JWT được mô tả tại [[API-Authentication]]
Lợi ích
-  Tạo knowledge graph 
-  Trace requirement dễ dàng 
-  Điều hướng nhanh 
-  Tìm dependency giữa module 

---
6. Tag Convention
Tag đề xuất
This content is only supported in a Lark Docs

---
7. Plugin nên cài
Bắt buộc
This content is only supported in a Lark Docs

---
8. Workflow đề xuất cho team dev
Khi có requirement mới
Business -> Requirement Note
                ↓
           Technical Analysis
                ↓
         Architecture Design
                ↓
            API Definition
                ↓
         Database Design
                ↓
             Task Breakdown

---
9. Meeting Workflow
Sau mỗi cuộc họp
Tạo file:
Meeting-YYYY-MM-DD.md
Nội dung
# Thành phần

# Nội dung trao đổi

# Decision

# Action Items

# Deadline

# Người phụ trách

---
10. Quản lý task bằng Kanban
Ví dụ:
## TODO
- [ ] Login API
- [ ] Setup CI/CD

## DOING
- [ ] Mobile Authentication

## DONE
- [x] Database Design

---
11. Quản lý tài liệu AI/Prompt
Do team dev hiện dùng AI nhiều, nên tạo riêng:
06-AI/
Ví dụ:
Prompt-Summary-Meeting.md
Prompt-Code-Review.md
Prompt-Generate-Testcase.md

---
12. Best Practice
Nên làm
-  Viết ngắn gọn 
-  Link tài liệu liên quan 
-  Có sơ đồ 
-  Có ví dụ code 
-  Có decision log 
-  Commit Obsidian vault lên Git 

---
Không nên
-  Viết quá dài một file 
-  Đặt tên không thống nhất 
-  Không dùng tag 
-  Không update meeting note 
-  Lưu tài liệu rải rác 

---
13. Kết hợp Git
Khuyến nghị:
git init
git remote add origin <repo>
Ignore file
.gitignore
.obsidian/workspace.json
.obsidian/cache

---
14. Kết hợp AI
Có thể dùng:
- OpenAI ChatGPT 
- Claude
- Cursor
- Windsurf
để:
-  Sinh meeting summary 
-  Generate testcase 
-  Generate API document 
-  Viết SRS 
-  Review code 
-  Sinh SQL 
-  Generate prompt library 

---
15. Mô hình triển khai thực tế cho team
Team nhỏ (1-5 người)
1 vault chung
Team vừa (5-20 người)
- 1 vault technical
- 1 vault business
- sync qua Git
Team lớn
- Vault theo domain
- Vault theo microservice
- Knowledge base riêng

---
16. Kết luận
Sử dụng Obsidian đúng cách giúp:
-  Quản lý tri thức hiệu quả 
-  Giảm phụ thuộc cá nhân 
-  Tăng tốc onboarding 
-  Chuẩn hóa tài liệu 
-  Kết nối business ↔ technical ↔ AI 
-  Scale team dễ hơn trong các dự án phần mềm lớn 