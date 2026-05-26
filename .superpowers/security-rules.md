---
title: Security Rules — StemVerse
version: 1.0.0
created: 2026-05-26
---

# Security Rules — StemVerse

## 1. Authentication & Authorization

### JWT Rules
- Access token expire: **15 minutes**
- Refresh token expire: **30 days**
- Algorithm: **RS256** (asymmetric, NOT HS256)
- Payload: `{ sub, email, role, iat, exp }` — NO sensitive data

### Route Protection
```typescript
// Every protected route MUST have JwtAuthGuard
@UseGuards(JwtAuthGuard)
// Admin routes ALSO need RolesGuard
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
```

### Ownership Checks (CRITICAL)
Before any mutation, verify the user owns the resource:

```typescript
// ✅ Always verify ownership
async deleteSong(songId: string, userId: string) {
  const song = await this.prisma.song.findUnique({ where: { id: songId } });
  if (!song) throw new NotFoundException();
  if (song.ownerId !== userId) throw new ForbiddenException();
  // proceed with delete
}
```

---

## 2. Input Validation

### All Input MUST Be Validated
```typescript
// ✅ Use class-validator DTO
export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsInt()
  @Min(1)
  @Max(300)
  @IsOptional()
  bpm?: number;
}
```

### File Upload Validation
```typescript
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/flac'];
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

// Validate MIME type (not just extension)
if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
  throw new BadRequestException('Invalid file type');
}
```

---

## 3. Audio File Security

### Signed URLs (MANDATORY)
```typescript
// ✅ Always use signed URLs for audio access
const url = await this.r2.getSignedUrl({
  Bucket: 'stemverse-audio',
  Key: fileKey,
  Expires: 3600, // 1 hour
});

// ❌ Never expose direct storage URLs
return `https://r2.cloudflare.com/${fileKey}`; // FORBIDDEN
```

### Anti-Piracy Watermark
- Every published audio file gets an **invisible audio watermark**
- Watermark contains: `userId + songId + timestamp`
- Enables tracking if file is leaked

### DRM Streaming
- Use HLS (HTTP Live Streaming) for premium content
- Signed HLS manifests expire after 1 hour
- No direct MP3 download without license

---

## 4. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 10 requests | 1 minute |
| `/auth/register` | 5 requests | 1 minute |
| `/music/upload` | 10 requests | 1 hour |
| `/ai/remix` | 5 requests (free) | 1 hour |
| `/ai/remix` | 50 requests (premium) | 1 hour |
| Public API | 100 requests | 1 minute |

---

## 5. SQL Injection Prevention

Prisma + parameterized queries = safe by default.

For raw queries (only complex CTEs):
```typescript
// ✅ SAFE: Use Prisma.$queryRaw with tagged template
await this.prisma.$queryRaw`
  SELECT * FROM songs WHERE id = ${songId}
`;

// ❌ DANGEROUS: String concatenation
await this.prisma.$queryRaw(`SELECT * FROM songs WHERE id = '${songId}'`);
```

---

## 6. Legal Hard Rules

These are absolute prohibitions:

1. **Celebrity voice cloning** — `HttpStatus.FORBIDDEN` + flag account
2. **AI voice without consent proof** — Reject upload
3. **Copyright content without rights claim** — Require agreement
4. **DMCA ignoring** — Must process within 48 hours

---

## 7. Environment Variables

**NEVER** commit secrets to Git:

```bash
# .env.example (commit this)
DATABASE_URL=postgresql://user:password@localhost:5432/stemverse
JWT_PRIVATE_KEY=your-rs256-private-key
CLOUDFLARE_R2_ACCESS_KEY=your-key
STRIPE_SECRET_KEY=sk_live_xxx

# .env (NEVER commit — in .gitignore)
DATABASE_URL=postgresql://realuser:realpass@prod-host:5432/stemverse_prod
```

`.gitignore` must contain:
```
.env
.env.local
.env.production
```

---

## 8. CORS Policy

```typescript
app.enableCors({
  origin: ['https://stemverse.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

---

## 9. Security Checklist (Before Each PR)

- [ ] No secrets in code or commits
- [ ] All routes have appropriate guards
- [ ] Ownership verified before mutations
- [ ] Input validated with DTOs
- [ ] Audio access uses signed URLs
- [ ] Rate limiting applied
- [ ] Error messages don't leak internal details
