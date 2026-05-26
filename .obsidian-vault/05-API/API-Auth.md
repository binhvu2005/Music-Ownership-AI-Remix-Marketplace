---
title: API — Authentication
created: 2026-05-26
status: Implemented
tags:
  - api
  - auth
  - jwt
---

# API — Authentication

> Base URL: `http://localhost:3001/auth`

---

## Endpoints

### POST /auth/register

**Mô tả:** Đăng ký tài khoản mới bằng email/mật khẩu.

**Request Body:**
```json
{
  "email": "user@stemverse.com",
  "password": "SecureP@ss123",
  "displayName": "Music Creator"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `email` | Required, valid email format |
| `password` | Required, 8–64 characters |
| `displayName` | Optional, max 100 characters |

**Response 201:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@stemverse.com",
    "role": "consumer",
    "displayName": "Music Creator",
    "isVerified": false,
    "createdAt": "2026-05-26T00:00:00.000Z"
  }
}
```

**Errors:**
| Status | Message | Khi nào |
|--------|---------|---------|
| 409 | Email already registered | Email đã tồn tại |
| 400 | Validation error | Input không hợp lệ |

---

### POST /auth/login

**Mô tả:** Đăng nhập và nhận JWT access token.

**Request Body:**
```json
{
  "email": "user@stemverse.com",
  "password": "SecureP@ss123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@stemverse.com",
    "role": "consumer",
    "displayName": "Music Creator"
  }
}
```

**Errors:**
| Status | Message | Khi nào |
|--------|---------|---------|
| 401 | Invalid credentials | Email không tồn tại hoặc sai mật khẩu |
| 401 | Account has been suspended | Tài khoản bị cấm |

---

### GET /auth/me

**Mô tả:** Lấy thông tin profile user hiện tại.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@stemverse.com",
  "role": "consumer",
  "displayName": "Music Creator",
  "avatarUrl": null,
  "bio": null,
  "isVerified": false,
  "createdAt": "2026-05-26T00:00:00.000Z"
}
```

**Errors:**
| Status | Message | Khi nào |
|--------|---------|---------|
| 401 | Unauthorized | Token hết hạn hoặc không hợp lệ |

---

## JWT Token Structure

**Payload:**
```json
{
  "sub": "user-uuid",
  "email": "user@stemverse.com",
  "role": "consumer",
  "iat": 1716681600,
  "exp": 1716768000
}
```

**Expiry:** 86400 seconds (1 ngày)

---

## Security

| Thành phần | Chi tiết |
|-----------|---------|
| Password Hashing | bcrypt, salt rounds = 12 |
| Token Type | Bearer JWT |
| CORS | Chỉ cho phép `FRONTEND_URL` |
| Validation | class-validator qua global ValidationPipe |

---

## Related
- [[SRS-Authentication]]
- [[Authentication-Service]]
- [[Table-Users]]
