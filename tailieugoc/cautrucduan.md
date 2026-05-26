Dưới đây là cấu trúc dự án Next.js thương mại điện tử + Obsidian + Superpowers.
ecommerce-nextjs/
│
├── app/                         # Next.js App Router
│   ├── (public)/
│   │   ├── page.tsx             # Trang chủ
│   │   ├── products/
│   │   ├── categories/
│   │   └── product/[slug]/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (customer)/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── profile/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   └── promotions/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── payment/
│   │   └── upload/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                      # Button, Input, Modal...
│   ├── layout/                  # Header, Footer, Sidebar
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── payment/
│   ├── promotion/
│   └── user/
│
├── lib/
│   ├── db.ts                    # Prisma client / DB connect
│   ├── auth.ts                  # Auth config
│   ├── payment.ts               # Payment gateway
│   ├── cloudinary.ts            # Upload ảnh
│   ├── mail.ts
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── hooks/
├── stores/                      # Zustand / Redux
├── types/
├── validations/                 # Zod schema
├── services/                    # API service/client
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
│   ├── images/
│   └── icons/
│
├── .obsidian-vault/             # Knowledge base dự án
│   ├── 00-Dashboard/
│   │   └── Project-Dashboard.md
│   │
│   ├── 01-Business/
│   │   ├── Ecommerce-Overview.md
│   │   ├── User-Roles.md
│   │   ├── Business-Rules.md
│   │   └── User-Flows/
│   │       ├── Flow-Buy-Product.md
│   │       ├── Flow-Checkout.md
│   │       ├── Flow-Order-Cancel.md
│   │       └── Flow-Refund.md
│   │
│   ├── 02-SRS/
│   │   ├── SRS-Authentication.md
│   │   ├── SRS-Product.md
│   │   ├── SRS-Cart.md
│   │   ├── SRS-Order.md
│   │   ├── SRS-Payment.md
│   │   └── SRS-Admin.md
│   │
│   ├── 03-Architecture/
│   │   ├── System-Architecture.md
│   │   ├── Frontend-Architecture.md
│   │   ├── Backend-Architecture.md
│   │   ├── Database-Design.md
│   │   └── Deployment-Architecture.md
│   │
│   ├── 04-ADR/
│   │   ├── ADR-001-Use-Nextjs-App-Router.md
│   │   ├── ADR-002-Use-Prisma.md
│   │   ├── ADR-003-Use-NextAuth.md
│   │   └── ADR-004-Use-Zod-Validation.md
│   │
│   ├── 05-API/
│   │   ├── API-Auth.md
│   │   ├── API-Product.md
│   │   ├── API-Cart.md
│   │   ├── API-Order.md
│   │   ├── API-Payment.md
│   │   └── API-Admin.md
│   │
│   ├── 06-Database/
│   │   ├── ERD.md
│   │   ├── Table-User.md
│   │   ├── Table-Product.md
│   │   ├── Table-Cart.md
│   │   ├── Table-Order.md
│   │   └── Table-Payment.md
│   │
│   ├── 07-Superpowers/
│   │   ├── Brainstorming/
│   │   ├── Specs/
│   │   ├── Plans/
│   │   ├── TDD/
│   │   ├── Code-Review/
│   │   └── Retrospective/
│   │
│   ├── 08-Testing/
│   │   ├── Test-Strategy.md
│   │   ├── Testcase-Checkout.md
│   │   ├── Testcase-Payment.md
│   │   └── Testcase-Admin.md
│   │
│   ├── 09-Meeting/
│   ├── 10-Prompt-Library/
│   └── Assets/
│
├── .superpowers/                # Quy trình cho AI coding agent
│   ├── project-context.md
│   ├── coding-rules.md
│   ├── testing-rules.md
│   ├── security-rules.md
│   ├── review-checklist.md
│   └── workflows/
│       ├── feature-development.md
│       ├── bug-fix.md
│       ├── refactor.md
│       └── release.md
│
├── .env.example
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
Workflow sử dụng
1. Viết requirement trong .obsidian-vault/01-Business
2. Tách thành SRS trong .obsidian-vault/02-SRS
3. Tạo ADR nếu có quyết định kỹ thuật
4. Tạo plan trong .obsidian-vault/07-Superpowers/Plans
5. Đưa plan cho AI agent dùng Superpowers
6. Code trong Next.js theo TDD
7. Lưu API, DB, testcase, lesson learned lại Obsidian
File nên tạo đầu tiên
.obsidian-vault/00-Dashboard/Project-Dashboard.md
.obsidian-vault/01-Business/Ecommerce-Overview.md
.obsidian-vault/02-SRS/SRS-Product.md
.obsidian-vault/02-SRS/SRS-Cart.md
.obsidian-vault/02-SRS/SRS-Order.md
.obsidian-vault/03-Architecture/System-Architecture.md
.obsidian-vault/04-ADR/ADR-001-Use-Nextjs-App-Router.md
.superpowers/project-context.md
.superpowers/coding-rules.md
Gợi ý ngắn
Với dự án thương mại điện tử, nên để Obsidian vault nằm trong repo để AI agent đọc được context, nhưng ignore các file workspace:
.obsidian/
.obsidian/workspace.json
.obsidian/cache
Cấu trúc này phù hợp để phát triển bằng Cursor / Claude Code / Codex / Gemini CLI theo kiểu AI-assisted development.