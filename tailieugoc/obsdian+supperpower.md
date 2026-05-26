Mục tiêu
- Obsidian: nơi lưu tài liệu, spec, ADR, meeting, prompt, plan. 
- Superpowers: quy trình làm việc cho AI agent khi code: brainstorming → spec → plan → TDD → review → hoàn tất branch. 
-  Kết hợp lại để tạo hệ thống: 
Ý tưởng → Spec → Plan → Code bằng AI Agent → Test → Review → Knowledge lưu lại Obsidian
Superpowers là “complete software development methodology for coding agents”, gồm các skill như brainstorming, writing-plans, test-driven-development, code review, git worktrees. 
Cấu trúc Obsidian nên dùng
Project-Knowledge/
├── 00-Dashboard/
├── 01-Requirements/
├── 02-Specs/
├── 03-Implementation-Plans/
├── 04-Architecture/
├── 05-ADR/
├── 06-Testing/
├── 07-Code-Review/
├── 08-AI-Agent/
│   ├── Superpowers/
│   ├── Prompts/
│   └── Runbooks/
├── 09-Meeting/
└── Assets/
Workflow chuẩn
1. Ghi ý tưởng / requirement vào Obsidian
2. Dùng Superpowers brainstorming để làm rõ yêu cầu
3. Lưu spec đã chốt vào Obsidian
4. Dùng Superpowers writing-plans để tạo implementation plan
5. AI agent code theo plan
6. Superpowers ép TDD: RED → GREEN → REFACTOR
7. Review code
8. Lưu kết quả, decision, bug, lesson learned vào Obsidian
Template file Spec
---
type: spec
project: LMS
module: authentication
status: approved
owner: backend-team
created: 2026-05-26
---

# Problem

# Goal

# Scope

# User Flow

# Technical Design

# API

# Database

# Edge Cases

# Acceptance Criteria

# Related
- [[ADR-001-Authentication]]
- [[Plan-Authentication]]
Template Implementation Plan cho Superpowers
---
type: implementation-plan
status: ready
agent: superpowers
module: authentication
---

# Objective

# Approved Spec
[[Spec-Authentication]]

# Tasks

## Task 1: Write failing test
- File:
- Expected failure:

## Task 2: Implement minimal code
- File:
- Logic:

## Task 3: Refactor
- Cleanup:

## Task 4: Verify
- Command:
```bash
npm test
Review Checklist
-  Đúng spec 
-  Có test 
-  Không over-engineering 
-  Không phá flow cũ 

## Cách cài Superpowers

Repo hỗ trợ nhiều agent như Claude Code, Codex CLI/App, Gemini CLI, OpenCode, Cursor, GitHub Copilot CLI. :contentReference[oaicite:1]{index=1}

Ví dụ với **Cursor**:

```text
/add-plugin superpowers
Với Gemini CLI:
gemini extensions install https://github.com/obra/superpowers
Với Claude Code:
/plugin install superpowers@claude-plugins-official
Kết luận
Obsidian là bộ nhớ dự án.
 Superpowers là quy trình điều khiển AI agent code đúng cách.
Kết hợp lại sẽ thành:
Developer Knowledge System + AI Coding Methodology