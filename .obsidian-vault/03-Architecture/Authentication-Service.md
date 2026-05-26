# Authentication Service — Kiến trúc & Tài liệu

> **Module:** `code/backend/src/auth/`  
> **Status:** ✅ Hoàn thành  
> **Ngày tạo:** 2026-05-26  
> **Test Coverage:** ≥ 90% (AuthService: 100% Stmts, 100% Lines, 90% Branch)

---

## Tổng quan

Hệ thống xác thực dựa trên **JWT (JSON Web Token)** và **Passport** cho NestJS Backend. Hỗ trợ đăng ký bằng email/mật khẩu, đăng nhập, và bảo vệ routes bằng JWT Guard + RBAC.

## Kiến trúc

```
src/auth/
├── dto/
│   ├── register.dto.ts          # Email + Password (8-64 ký tự) + DisplayName (optional)
│   └── login.dto.ts             # Email + Password
├── auth.service.ts              # Business logic (register, login, getProfile)
├── auth.service.spec.ts         # 12 unit tests (TDD)
├── auth.controller.ts           # REST endpoints
├── auth.controller.spec.ts      # 4 unit tests
├── auth.module.ts               # NestJS module wiring
├── jwt.strategy.ts              # Passport JWT Strategy
├── jwt-auth.guard.ts            # @UseGuards(JwtAuthGuard)
├── roles.decorator.ts           # @Roles('admin', 'creator')
├── roles.guard.ts               # RBAC Guard
└── roles.guard.spec.ts          # 4 unit tests
```

## API Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| `POST` | `/auth/register` | ❌ Public | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | ❌ Public | Đăng nhập → nhận JWT token |
| `GET` | `/auth/me` | ✅ JWT | Lấy thông tin user hiện tại |

## Bảo mật

| Thành phần | Chi tiết |
|-----------|---------|
| **Password Hashing** | bcrypt, salt rounds = 12 |
| **JWT Payload** | `{ sub: userId, email, role }` |
| **Token Expiry** | 86400 seconds (1 ngày) — cấu hình qua `JWT_EXPIRES_IN_SECONDS` |
| **JWT Secret** | Biến môi trường `JWT_SECRET` |
| **Validation** | `class-validator` via global `ValidationPipe` |
| **CORS** | Chỉ cho phép `FRONTEND_URL` (default: `http://localhost:3000`) |

## Xử lý lỗi

| Tình huống | HTTP Status | Exception |
|-----------|-------------|-----------|
| Email đã tồn tại | 409 | `ConflictException('Email already registered')` |
| Email/mật khẩu sai | 401 | `UnauthorizedException('Invalid credentials')` |
| Tài khoản OAuth (không có mật khẩu) | 401 | `UnauthorizedException('Invalid credentials')` |
| Tài khoản bị cấm | 401 | `UnauthorizedException('Account has been suspended')` |
| Không đủ quyền (role) | 403 | `ForbiddenException(...)` |
| Token không hợp lệ/hết hạn | 401 | Passport tự trả về |

## Sử dụng RBAC

```typescript
// Bảo vệ route chỉ cho admin
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete('users/:id')
async banUser(@Param('id') id: string) { ... }

// Bảo vệ route cho creator hoặc admin
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('creator', 'admin')
@Post('songs')
async createSong(@Body() dto: CreateSongDto) { ... }
```

## Environment Variables

```env
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN_SECONDS=86400
FRONTEND_URL=http://localhost:3000
```

## Quy trình TDD đã tuân thủ

1. **🔴 RED:** Viết 12 test cases cho AuthService mô tả hành vi trước khi viết code
2. **🟢 GREEN:** Viết code tối thiểu → 12/12 PASS
3. **🔵 REFACTOR:** Export types, fix strict TypeScript errors, thêm tests cho Controller (4) và RolesGuard (4)
4. **Verification:** 21/21 tests PASS, `nest build` thành công, coverage ≥ 90%
