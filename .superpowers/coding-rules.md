---
title: Coding Rules — StemVerse
version: 1.0.0
created: 2026-05-26
---

# Coding Rules — StemVerse

> **THE 3 IRON LAWS** — Vi phạm bất kỳ luật nào = Code bị reject

## ⚔️ Iron Law 1: NO SPEC → NO CODE

Tuyệt đối **KHÔNG** viết bất kỳ logic code nào nếu chưa có Spec được phê duyệt.

- Spec file ở: `.obsidian-vault/02-SRS/SRS-Overview.md`
- Spec phải có: Problem, Goal, API, Database, Edge Cases, Acceptance Criteria
- **Action**: Nếu không có Spec → Tạo Spec trước, hỏi xác nhận, sau đó mới code

## ⚔️ Iron Law 2: NO FAILING TEST → NO PRODUCTION CODE

Mọi code mới PHẢI bắt đầu bằng failing test (Red Phase).

```
RED: Write failing test first
  ↓
GREEN: Write minimal code to pass
  ↓
REFACTOR: Clean up
```

**Violation examples** (không được làm):
- "Let me write the service first, then add tests"
- "Tests can be added later"
- "This is simple enough to skip tests"

## ⚔️ Iron Law 3: EVIDENCE BEFORE REPORT

**CẤMTUYỆT ĐỐI** dùng các cụm từ:
- "Should work"
- "Hình như xong rồi"
- "Probably fine"
- "I think it's working"

Mọi báo cáo hoàn thành PHẢI kèm test output thực tế:

```
✅ CORRECT: "All 24 tests pass: npm test -- --coverage shows 87% coverage"
❌ WRONG: "The service should be working now"
```

---

## 📐 Code Style Rules

### TypeScript (NestJS)

```typescript
// ✅ CORRECT: Explicit types, no any
async createSong(dto: CreateSongDto, userId: string): Promise<Song> {
  // ...
}

// ❌ WRONG: any types
async createSong(dto: any, userId: any): Promise<any> {
  // ...
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `songTitle`, `ownerId` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE_MB` |
| Classes | PascalCase | `SongsService` |
| Interfaces | PascalCase (no I prefix) | `CreateSongDto` |
| Files | kebab-case | `songs.service.ts` |
| DB columns | snake_case | `owner_id`, `created_at` |

### Error Handling

```typescript
// ✅ CORRECT: Specific exceptions
throw new NotFoundException(`Song ${songId} not found`);
throw new ForbiddenException('You do not own this song');
throw new BadRequestException('Remix not allowed for this song');

// ❌ WRONG: Generic errors
throw new Error('Something went wrong');
```

### Async/Await

```typescript
// ✅ CORRECT
const song = await this.songsService.findOne(id);

// ❌ WRONG: Callback hell
this.songsService.findOne(id).then(song => { ... });
```

---

## 🏗 Architecture Rules

### 1. Single Responsibility

Mỗi service chỉ làm một việc:

```
✅ SongsService: Song CRUD only
✅ RoyaltyService: Royalty calculation only
❌ SongsService: Song CRUD + Royalty calculation (violation)
```

### 2. No Direct Cross-Service DB Queries

Microservices không được query DB của service khác trực tiếp:

```
✅ music-service → HTTP request → royalty-service
❌ music-service → Direct query to royalty DB
```

### 3. Validate at Boundary

Validate input tại controller, không tại service:

```typescript
// ✅ Controller validates
@Post()
async create(@Body() dto: CreateSongDto) { ... }  // DTO có decorators

// ❌ Service validates
async create(data: any) {
  if (!data.title) throw new Error(); // wrong layer
}
```

### 4. No Business Logic in Controllers

```typescript
// ✅ Controller: thin
@Post()
async create(@Body() dto: CreateSongDto, @Req() req) {
  return this.songsService.create(dto, req.user.id);
}

// ❌ Controller: fat (wrong)
@Post()
async create(@Body() dto, @Req() req) {
  const song = await this.prisma.song.create({ data: dto });
  await this.bullQueue.add('process', { songId: song.id });
  return song;
}
```

---

## 🗄 Database Rules

### 1. Never Raw SQL (use Prisma)

```typescript
// ✅ Prisma
const song = await this.prisma.song.findUnique({ where: { id } });

// ❌ Raw SQL (exception: complex CTEs)
await this.prisma.$queryRaw`SELECT * FROM songs WHERE id = ${id}`;
```

### 2. Ownership Relations = IMMUTABLE

```typescript
// ✅ Create only
await this.prisma.ownershipRelation.create({ data: ... });

// ❌ NEVER update ownership records
await this.prisma.ownershipRelation.update(...); // VIOLATION
```

### 3. Always Use Transactions for Multi-Step

```typescript
// ✅ Atomic operation
await this.prisma.$transaction([
  this.prisma.song.create({ data: songData }),
  this.prisma.ownershipRelation.create({ data: ownerData }),
]);
```

### 4. Money = Integer Cents

```typescript
// ✅ Store as cents
const priceInCents = 2999; // = $29.99

// ❌ Never store as float
const price = 29.99; // floating point errors!
```

---

## 🔒 Security Rules

### 1. Never Trust Client Input

```typescript
// ✅ Always validate with DTO + guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('creator')
async delete(@Param('id') id: string, @Req() req) {
  // Check ownership before delete
  await this.songsService.validateOwner(id, req.user.id);
  return this.songsService.delete(id);
}
```

### 2. Signed URLs for All Audio Access

```typescript
// ✅ Generate signed URL, never expose direct R2 URL
const signedUrl = await this.r2Service.getSignedUrl(fileKey, 3600);
return { url: signedUrl };

// ❌ Never return raw R2 URL
return { url: `https://r2.cloudflarestorage.com/bucket/${fileKey}` };
```

### 3. Rate Limiting on All Endpoints

```typescript
// ✅ Rate limit applied at gateway
// Gateway config: 100 req/min per IP for public endpoints
// Auth endpoints: 10 req/min per IP
```

---

## 📝 Git Commit Rules

```
Format: <type>(<scope>): <description>

Types:
  feat     New feature
  fix      Bug fix
  test     Add tests
  refactor Refactor code
  docs     Documentation
  chore    Config, build

Examples:
✅ feat(songs): add chunked upload with presigned URLs
✅ test(royalty): add unit tests for split calculation
✅ fix(auth): refresh token rotation bug
❌ update stuff
❌ fix bug
❌ WIP
```

---

## 🧪 Testing Rules (Detail)

See `.superpowers/testing-rules.md` for full testing guidelines.

Summary:
- Unit tests: `*.spec.ts` next to service file
- Integration tests: `test/` directory
- Test coverage minimum: **85%**
- Always mock external services (R2, Stripe, Redis)

---

## 🎨 Theme & i18n Rules (Giao diện linh hoạt & Đa ngôn ngữ)

Để đảm bảo khả năng mở rộng và đồng bộ giao diện, mọi lập trình viên và AI Agent phải tuân thủ các quy tắc sau khi viết mã giao diện (UI):

### 1. Quy tắc Sáng/Tối (Theme Switching)
- **CẤM** viết cứng các mã màu (như `text-#000000`, `bg-[#15121b]`) trực tiếp trong class component trừ các trường hợp đặc biệt.
- **BẮT BUỘC** sử dụng các biến CSS Theme (ví dụ: `var(--background)`, `var(--foreground)`, `var(--primary)`, `var(--surface)`) hoặc các CSS class token của Tailwind v4 được ánh xạ từ CSS variables.
- Hỗ trợ đổi theme bằng cách bật/tắt class `.dark` ở thẻ `html` hoặc `body`.

### 2. Quy tắc Đa ngôn ngữ (i18n Rules)
- **CẤM** viết cứng văn bản tĩnh trực tiếp bằng Tiếng Việt hoặc Tiếng Anh trong file TSX/JSX (ví dụ: `<h1>Chào mừng quay lại</h1>`).
- **BẮT BUỘC** khai báo nội dung hiển thị trong các file từ điển ngôn ngữ tại `src/locales/en.json` (Tiếng Anh) và `src/locales/vi.json` (Tiếng Việt).
- Sử dụng hook dịch (ví dụ: `t('auth.login.title')`) để hiển thị văn bản động, đảm bảo việc dịch tự động hoạt động hoàn hảo khi người dùng chọn chuyển đổi ngôn ngữ.
- Mọi nhãn (label), placeholder, câu thông báo lỗi hoặc nút bấm đều phải được bao bọc qua hàm dịch.
