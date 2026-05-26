# Music Upload System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hệ thống tải bài hát trực tiếp lên Cloudflare R2 qua Presigned URLs, hàng đợi BullMQ, và dịch vụ phân tích âm thanh FastAPI AI Service trong Docker.

**Architecture:** Client chia nhỏ file (5MB chunks), xin Presigned URL từ NestJS để tải trực tiếp lên R2. Sau khi hoàn thành, NestJS ghép file và đẩy Job vào hàng đợi Redis (BullMQ). BullMQ Worker của NestJS gọi FastAPI AI Service (chạy trong Docker) để xử lý waveform/tempo/key rồi cập nhật kết quả vào database.

**Tech Stack:** NestJS, Prisma, Cloudflare R2 (AWS S3 Client), Redis (BullMQ), FastAPI (Python 3.10-slim, Librosa, FFmpeg), Next.js 15.

---

## Proposed Changes & Tasks

### Task 1: Setup S3 R2 Client & Config in Backend (NestJS)

**Files:**
- Create: `code/backend/src/prisma/r2.service.ts`
- Modify: `code/backend/package.json`
- Test: `code/backend/src/prisma/r2.service.spec.ts`

- [ ] **Step 1: Cài đặt S3 dependencies**
  Run: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner` tại `code/backend`
- [ ] **Step 2: Viết file test r2.service.spec.ts kiểm tra S3 client**
  ```typescript
  import { Test, TestingModule } from '@nestjs/testing';
  import { R2Service } from './r2.service';
  import { ConfigService } from '@nestjs/config';

  describe('R2Service', () => {
    let service: R2Service;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          R2Service,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === 'CLOUDFLARE_R2_ENDPOINT') return 'https://7a7c0c77b860c4763bbe740c158511dd.r2.cloudflarestorage.com';
                if (key === 'CLOUDFLARE_R2_ACCESS_KEY_ID') return '208f6217a63cd8f95d020ef2aaa5fc2d';
                if (key === 'CLOUDFLARE_R2_SECRET_ACCESS_KEY') return 'mock-secret';
                if (key === 'CLOUDFLARE_R2_BUCKET_NAME') return 'music';
                return null;
              }),
            },
          },
        ],
      }).compile();

      service = module.get<R2Service>(R2Service);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
  ```
- [ ] **Step 3: Viết minimal implementation cho R2Service**
  ```typescript
  import { Injectable } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { S3Client } from '@aws-sdk/client-s3';

  @Injectable()
  export class R2Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
      this.bucketName = this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME') || '';
      this.s3Client = new S3Client({
        endpoint: this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT'),
        credentials: {
          accessKeyId: this.configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID') || '',
          secretAccessKey: this.configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY') || '',
        },
        region: 'auto',
      });
    }

    getS3Client(): S3Client {
      return this.s3Client;
    }

    getBucketName(): string {
      return this.bucketName;
    }
  }
  ```
- [ ] **Step 4: Chạy test verify**
  Run: `npm run test` (hoặc chạy test r2.service)
- [ ] **Step 5: Commit**
  ```bash
  git add code/backend/package.json code/backend/src/prisma/r2.service.ts code/backend/src/prisma/r2.service.spec.ts
  git commit -m "feat: setup S3 R2 service client and configuration in NestJS"
  ```

---

### Task 2: Implement Multipart Upload API (NestJS)

**Files:**
- Create: `code/backend/src/music/music-upload.service.ts`
- Create: `code/backend/src/music/music-upload.controller.ts`
- Create: `code/backend/src/music/music.module.ts`
- Modify: `code/backend/src/app.module.ts`

- [ ] **Step 1: Viết spec tests cho MusicUploadService**
  Viết test kiểm tra các hàm: `initializeUpload`, `getPresignedUrl`, `completeUpload` hoạt động chính xác (mocking S3 client calls).
- [ ] **Step 2: Viết service implementation**
  *   `initializeUpload`: Gọi S3 `CreateMultipartUploadCommand` lấy `UploadId`. Tạo Song record mới với trạng thái `queued`.
  *   `getPresignedUrl`: Gọi S3 `UploadPartCommand` kết hợp `getSignedUrl` để sinh url.
  *   `completeUpload`: Gọi S3 `CompleteMultipartUploadCommand` để hoàn tất.
- [ ] **Step 3: Viết controller & router mapping**
  *   `POST /music/upload/init`
  *   `GET /music/upload/:sessionId/url`
  *   `POST /music/upload/:sessionId/complete`
- [ ] **Step 4: Đăng ký MusicModule vào AppModule**
- [ ] **Step 5: Chạy tests verify**
- [ ] **Step 6: Commit**

---

### Task 3: Setup Redis BullMQ Queue & Worker in Backend (NestJS)

**Files:**
- Modify: `code/backend/package.json`
- Create: `code/backend/src/music/audio-analysis.processor.ts`
- Modify: `code/backend/src/music/music.module.ts`

- [ ] **Step 1: Cài đặt BullMQ NestJS packages**
  Run: `npm install @nestjs/bullmq bullmq` tại `code/backend`
- [ ] **Step 2: Viết test cho audio analysis processor**
  Kiểm tra processor có nhận Job từ queue, gọi HTTP client phân tích, và ghi đè kết quả vào database.
- [ ] **Step 3: Viết Processor implementation**
  ```typescript
  import { Processor, WorkerHost } from '@nestjs/bullmq';
  import { Job } from 'bullmq';
  import { PrismaService } from '../prisma/prisma.service';

  @Processor('audio-analysis')
  export class AudioAnalysisProcessor extends WorkerHost {
    constructor(private prisma: PrismaService) {
      super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
      const { songId, fileUrl } = job.data;
      // 1. Gọi FastAPI analyze
      // 2. Nhận kết quả và lưu vào Prisma database
    }
  }
  ```
- [ ] **Step 4: Chạy test verify**
- [ ] **Step 5: Commit**

---

### Task 4: Setup FastAPI AI Service Boilerplate in Docker

**Files:**
- Create: `code/ai-service/requirements.txt`
- Create: `code/ai-service/Dockerfile`
- Create: `code/ai-service/main.py`
- Create: `code/ai-service/utils/audio.py`
- Modify: `docker-compose.yml`

- [ ] **Step 1: Viết tệp requirements.txt và Dockerfile**
- [ ] **Step 2: Viết code Python phân tích trong main.py & utils/audio.py**
  *   Sử dụng `librosa.beat.beat_track` để detect BPM.
  *   Sử dụng phân tích chroma để detect Key.
  *   Sử dụng librosa trích xuất 150 points waveform amplitude.
- [ ] **Step 3: Tích hợp ai-service vào docker-compose.yml**
- [ ] **Step 4: Chạy docker-compose up --build để khởi tạo**
- [ ] **Step 5: Commit**

---

### Task 5: Implement Next.js 15 Frontend Upload Page

**Files:**
- Create: `code/frontend/src/app/(creator)/upload/page.tsx`
- Modify: `code/frontend/src/components/layout/Navbar.tsx` (Thêm link Upload cho Creator)

- [ ] **Step 1: Viết giao diện Upload form**
- [ ] **Step 2: Viết hàm slice file & upload tuần tự từng chunk 5MB trực tiếp lên R2**
- [ ] **Step 3: Hiển thị thanh tiến trình chi tiết**
- [ ] **Step 4: Chạy build frontend xác minh**
- [ ] **Step 5: Commit**
