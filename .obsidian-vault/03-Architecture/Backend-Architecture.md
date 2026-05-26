---
title: Backend Architecture
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - backend
  - nestjs
---

# Backend Architecture — StemVerse

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS (TypeScript) |
| ORM | Prisma |
| Auth | Passport.js (JWT + OAuth2) |
| Validation | class-validator + Zod |
| Queue | BullMQ |
| Cache | ioredis |
| Email | Nodemailer + Resend |
| Storage | @aws-sdk/client-s3 (Cloudflare R2) |
| Testing | Jest + Supertest |

## Microservice Structure

```
backend/
├── gateway-service/      # API Gateway (port 3000)
│   ├── src/
│   │   ├── middleware/   # Rate limiting, auth forward
│   │   ├── proxy/        # Reverse proxy to services
│   │   └── main.ts
│   └── package.json
│
├── auth-service/         # Auth (port 3001)
│   ├── src/
│   │   ├── auth/         # AuthModule, AuthController, AuthService
│   │   ├── jwt/          # JWT strategy, guards
│   │   ├── oauth/        # Google, Discord, Spotify strategies
│   │   └── users/        # UsersModule
│   └── prisma/
│
├── music-service/        # Music CRUD (port 3002)
│   ├── src/
│   │   ├── songs/        # SongsModule, SongsController, SongsService
│   │   ├── stems/        # StemsModule
│   │   ├── upload/       # UploadModule (presigned URLs)
│   │   └── waveform/     # WaveformModule
│   └── prisma/
│
├── ai-service/           # FastAPI + Python (port 8000)
│   ├── main.py
│   ├── routers/
│   │   ├── analysis.py   # /ai/analysis endpoints
│   │   └── remix.py      # /ai/remix endpoints
│   ├── services/
│   │   ├── demucs.py     # Stem separation
│   │   ├── librosa_service.py  # BPM, Key, Waveform
│   │   └── remix_engine.py     # AI Remix
│   └── workers/          # Celery workers
│
├── royalty-service/      # Ownership + Royalty (port 3003)
│   ├── src/
│   │   ├── ownership/    # OwnershipModule, Graph traversal
│   │   ├── royalty/      # RoyaltyModule, Calculator
│   │   └── wallet/       # WalletModule
│   └── prisma/
│
├── payment-service/      # Payments (port 3004)
│   ├── src/
│   │   ├── stripe/       # Stripe integration
│   │   ├── momo/         # MoMo API
│   │   └── vnpay/        # VNPay
│   └── prisma/
│
├── notification-service/ # Notifications (port 3005)
│   ├── src/
│   │   ├── email/        # Email templates + sender
│   │   ├── websocket/    # Socket.IO gateway
│   │   └── push/         # (Phase 3)
│   └── templates/
│
├── search-service/       # Search (port 3006)
│   ├── src/
│   │   ├── meilisearch/  # Meilisearch client
│   │   └── indexing/     # Indexing service
│   └── package.json
│
└── admin-service/        # Admin (port 3007)
    ├── src/
    │   ├── users/
    │   ├── dmca/
    │   └── disputes/
    └── prisma/
```

## NestJS Module Pattern

Mỗi feature module theo pattern:

```
feature/
├── feature.module.ts
├── feature.controller.ts   # HTTP handlers
├── feature.service.ts      # Business logic
├── feature.dto.ts          # Input validation
├── feature.entity.ts       # Prisma model wrapper
└── feature.spec.ts         # Unit tests
```

## Common Patterns

### Guard (Auth)

```typescript
@Controller('songs')
@UseGuards(JwtAuthGuard)
export class SongsController {
  @Get()
  @Public() // Decorator để bypass guard
  async getAll() { ... }
  
  @Post()
  @Roles('creator')
  async create() { ... }
}
```

### DTO Validation

```typescript
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

### Service Pattern

```typescript
@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    private r2Service: R2Service,
    @InjectQueue('audio-analysis') private analysisQueue: Queue,
  ) {}

  async create(dto: CreateSongDto, ownerId: string) {
    const song = await this.prisma.song.create({ data: { ...dto, ownerId } });
    await this.analysisQueue.add('process', { songId: song.id });
    return song;
  }
}
```

## Error Handling

```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Log + format error response
    return {
      statusCode: exception.status || 500,
      message: exception.message || 'Internal server error',
      timestamp: new Date().toISOString()
    };
  }
}
```

## Related

- [[System-Architecture]]
- [[Microservice-Map]]
- [[ADR-002-NestJS-Backend]]
- [[ADR-003-FastAPI-AI-Service]]
