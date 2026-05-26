# 🎵 StemVerse

> **"GitHub + Spotify + AI Remix Engine cho âm nhạc"**

AI-powered Music Ownership & Remix Marketplace

---

## What is StemVerse?

StemVerse là nền tảng cho phép:
- 🎵 **Upload** bài nhạc gốc (full track + stems)
- 🤖 **AI Remix** — text prompt → derivative track
- 📊 **Ownership Graph** — GitHub-style derivative tracking
- 💰 **Auto Royalty** — chia tiền tự động theo ownership chain
- 🏪 **Marketplace** — mua/bán license, stems, loops

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | NestJS (TypeScript) |
| AI Service | FastAPI (Python) + Demucs + MusicGen |
| Database | PostgreSQL 16 + Prisma |
| Cache/Queue | Redis + BullMQ |
| Storage | Cloudflare R2 |
| Payment | Stripe + MoMo + VNPay |
| Search | Meilisearch |

---

## Project Documentation

📁 `.obsidian-vault/` — Knowledge base (open in Obsidian)
- `00-Dashboard/Project-Dashboard.md` — **Start here**
- `01-Business/` — StemVerse Overview, User Roles, Business Rules, User Flows
- `02-SRS/` — Software Requirements (12 modules)
- `03-Architecture/` — System design, microservices, DB design, AI pipeline
- `04-ADR/` — 8 Architecture Decision Records
- `05-API/` — API contracts
- `06-Database/` — ERD + table schemas
- `07-Superpowers/` — AI agent specs, plans, TDD, reviews
- `08-Testing/` — Test strategy + test cases
- `09-MVP-Roadmap/` — Phase 1, 2, 3 plans
- `10-Prompt-Library/` — AI prompts for spec/plan/review

📁 `.superpowers/` — AI coding agent rules
- `project-context.md` — **AI reads this first**
- `coding-rules.md` — Iron Laws + code standards
- `testing-rules.md` — TDD methodology
- `security-rules.md` — Security requirements
- `review-checklist.md` — Quality gate
- `workflows/` — Feature, bug fix, refactor, release workflows

📄 `.cursorrules` — Config for AI agents (Cursor, Claude, Gemini)

---

## Development Workflow

```bash
# 1. Read .superpowers/project-context.md first!

# 2. Check if Spec exists for your feature
# .obsidian-vault/02-SRS/SRS-{module}.md

# 3. Write failing test first (TDD Red Phase)
npm test -- --testNamePattern="your test"

# 4. Implement minimal code (Green Phase)

# 5. Refactor + full test suite
npm test -- --coverage

# 6. Review checklist
# .superpowers/review-checklist.md
```

---

## MVP Phases

| Phase | Status | Features |
|-------|--------|---------|
| **Phase 1** | 🔴 In Progress | Upload, AI Analysis, Ownership Graph, AI Remix, Royalty, Licensing |
| **Phase 2** | ⬜ Planning | Realtime Collab, AI Voice, Full Marketplace |
| **Phase 3** | ⬜ Future | Mobile, Blockchain, Investor Royalties |

---

## Iron Laws (Non-Negotiable)

1. **NO SPEC → NO CODE** — Read `.obsidian-vault/02-SRS/` first
2. **NO FAILING TEST → NO PRODUCTION CODE** — TDD mandatory
3. **EVIDENCE BEFORE REPORT** — Show test output, not feelings

---

## Solo Developer

Dự án do 1 developer xây dựng. Dùng AI agent (Cursor/Claude/Gemini) để code theo Superpowers methodology.

---

*Made with ❤️ and way too many stem separations*
