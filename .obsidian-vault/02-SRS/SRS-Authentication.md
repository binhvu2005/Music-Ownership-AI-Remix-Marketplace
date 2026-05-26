---
title: SRS — Authentication
type: spec
project: StemVerse
module: authentication
status: Approved
owner: solo-dev
created: 2026-05-26
tags:
  - srs
  - auth
  - security
---

# SRS — Authentication

## Problem

StemVerse cần hệ thống xác thực an toàn cho 4 actor (Creator, Remixer, Consumer, Investor). Mỗi user có role và permission khác nhau. Dữ liệu nhạy cảm như ownership records và royalty wallets cần được bảo vệ.

## Goal

Xây dựng hệ thống authentication + authorization:
- Hỗ trợ Email/Password và OAuth (Google, Discord, Spotify)
- JWT-based session management
- Role-based access control (RBAC)
- Secure token refresh mechanism

## Scope

**In scope:**
- Email/Password registration & login
- Google OAuth 2.0
- Discord OAuth 2.0
- Spotify OAuth 2.0
- JWT access + refresh token
- Password reset via email
- Email verification
- Role assignment (creator, remixer, consumer, admin)

**Out of scope (Phase 1):**
- 2FA / MFA
- Magic link login
- Enterprise SSO

## User Flow

```
Registration:
User → Fill form → Validate → Hash password → Create user → Send verification email → Verify → Active

Login (Email):
User → Submit credentials → Validate → Check hash → Generate JWT → Return tokens

Login (OAuth):
User → Click OAuth button → Redirect to provider → Callback → Find/Create user → Generate JWT

Token Refresh:
Client → Send refresh_token → Validate → Generate new access_token → Return
```

## Technical Design

### Token Strategy
- **Access Token**: JWT, expire 15 minutes, signed với RS256
- **Refresh Token**: Opaque token, expire 30 days, stored in Redis
- **Rotation**: Refresh token được rotate mỗi lần use

### Password Hashing
- **Algorithm**: bcrypt, cost factor = 12

### JWT Payload
```json
{
  "sub": "user_id",
  "email": "user@email.com",
  "role": "creator",
  "iat": 1716700000,
  "exp": 1716700900
}
```

## API

| Method | Endpoint | Auth | Mô tả |
|--------|---------|------|-------|
| POST | `/auth/register` | Public | Đăng ký email/password |
| POST | `/auth/login` | Public | Đăng nhập |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | User | Logout, revoke refresh token |
| GET | `/auth/me` | User | Lấy info user hiện tại |
| POST | `/auth/forgot-password` | Public | Gửi reset email |
| POST | `/auth/reset-password` | Public | Reset password |
| GET | `/auth/google` | Public | OAuth Google redirect |
| GET | `/auth/google/callback` | Public | OAuth Google callback |
| GET | `/auth/discord` | Public | OAuth Discord redirect |
| GET | `/auth/spotify` | Public | OAuth Spotify redirect |

## Database

```sql
-- users table
id            UUID PRIMARY KEY
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255)        -- null nếu OAuth only
role          ENUM('creator','remixer','consumer','admin') DEFAULT 'consumer'
is_verified   BOOLEAN DEFAULT false
avatar_url    TEXT
display_name  VARCHAR(100)
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP

-- oauth_accounts table
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
provider    ENUM('google','discord','spotify')
provider_id VARCHAR(255)
UNIQUE(provider, provider_id)

-- refresh_tokens (in Redis)
Key: refresh_token:<token_hash>
Value: { user_id, expires_at }
TTL: 30 days
```

## Edge Cases

| Case | Handling |
|------|---------|
| Email chưa verify → login | Allow login nhưng feature bị giới hạn |
| OAuth email trùng với existing account | Auto-link accounts |
| Refresh token expired | Force re-login |
| Concurrent login từ nhiều devices | Cho phép (multiple refresh tokens) |
| Invalid/tampered JWT | Return 401 |
| Password reset link expired (1h) | Redirect về forgot-password form |

## Acceptance Criteria

- [ ] User đăng ký thành công với email/password → nhận verification email
- [ ] Login trả về access_token (15m) và refresh_token (30d)
- [ ] Google OAuth hoạt động (sandbox)
- [ ] Discord OAuth hoạt động (sandbox)
- [ ] Spotify OAuth hoạt động (sandbox)
- [ ] Refresh token rotation hoạt động
- [ ] Protected endpoint trả về 401 nếu không có token
- [ ] Admin role có thể access admin endpoints

## Related

- [[ADR-001-NextJS-Frontend]]
- [[ADR-002-NestJS-Backend]]
- [[API-Auth]]
- [[Table-Users]]
- [[Flow-Upload-Music]]
