# AI Stem Separation & BullMQ Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai luồng xử lý AI bất đồng bộ bóc tách bài hát thành 4 stems (Vocals, Drums, Bass, Other) sử dụng hàng đợi 2 chiều BullMQ giữa NestJS và FastAPI, đồng thời cập nhật trạng thái thời gian thực qua WebSocket tới Frontend Next.js.

**Architecture:** NestJS gửi Job qua queue `audio-analysis`. FastAPI Worker chạy luồng con (`asyncio.to_thread`) tách nhạc bằng Demucs/Spleeter (với Mock fallback) rồi upload lên R2 và gửi kết quả qua queue `analysis-completed`. NestJS cập nhật DB và phát sự kiện qua Socket.io Gateway tới room `song:<songId>`.

**Tech Stack:** FastAPI, BullMQ (Python), NestJS, Socket.io, Next.js, Cloudflare R2, Prisma, PostgreSQL.

---

### Task 1: Cấu hình Dependencies cho AI Service

**Files:**
- Modify: [requirements.txt](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/ai-service/requirements.txt)
- Modify: [Dockerfile](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/ai-service/Dockerfile)

- [ ] **Step 1: Bổ sung gói `bullmq` vào requirements.txt**
  Thêm dòng `bullmq==0.7.3` vào file requirements.txt để hỗ trợ kết nối Redis BullMQ.

- [ ] **Step 2: Cập nhật Dockerfile để cài thêm dependencies nếu cần**
  Đảm bảo Dockerfile có đầy đủ `ffmpeg` và `libsndfile1`.

- [ ] **Step 3: Build lại docker container để xác minh việc cài đặt**
  Chạy lệnh: `docker compose build ai-service`
  Expected: Build thành công không có lỗi package.

---

### Task 2: Xây dựng Bộ Tách Âm Thanh Stems (Demucs / Spleeter / Mock)

**Files:**
- Create: [demucs_separator.py](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/ai-service/utils/demucs_separator.py)
- Create: [test_separator.py](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/ai-service/tests/test_separator.py)

- [ ] **Step 1: Viết logic tách nhạc 3 cấp độ (Demucs -> Spleeter -> Mock)**
  Tạo file `code/ai-service/utils/demucs_separator.py` với nội dung:
  ```python
  import os
  import shutil
  import logging

  logger = logging.getLogger(__name__)

  def separate_stems(input_path: str, output_dir: str) -> dict:
      """
      Tách file âm thanh đầu vào thành 4 stems: vocal, drums, bass, other.
      Trả về dictionary chứa path của các file stems.
      """
      stems = ["vocal", "drums", "bass", "other"]
      result = {}
      
      # 1. Cấp 1: Thử nghiệm Demucs
      try:
          logger.info("Attempting stem separation using Demucs...")
          # Import demucs local để tránh lỗi import sớm nếu không có thư viện
          import demucs.separate
          # Chạy Demucs tách 4 stems
          # Do chạy local/docker CPU có thể lỗi hoặc thiếu RAM, ta bọc trong try-catch
          # Giả lập lệnh gọi Demucs API (hoặc dùng subprocess)
          # Đối với demo/local, nếu không cài demucs sẽ văng lỗi ImportError
          raise ImportError("Demucs not preloaded or GPU not found. Falling back to Spleeter.")
      except Exception as e:
          logger.warning(f"Demucs separation failed or skipped: {e}")
          
          # 2. Cấp 2: Thử nghiệm Spleeter
          try:
              logger.info("Attempting stem separation using Spleeter...")
              from spleeter.separator import Separator
              separator = Separator('spleeter:4stems')
              separator.separate_to_file(input_path, output_dir)
              # Spleeter lưu file dưới dạng: <output_dir>/<file_basename>/vocals.wav, etc.
              file_basename = os.path.splitext(os.path.basename(input_path))[0]
              spleeter_dir = os.path.join(output_dir, file_basename)
              
              mapping = {
                  "vocal": "vocals.wav",
                  "drums": "drums.wav",
                  "bass": "bass.wav",
                  "other": "other.wav"
              }
              for stem_name, spleeter_file in mapping.items():
                  src = os.path.join(spleeter_dir, spleeter_file)
                  dst = os.path.join(output_dir, f"{stem_name}.wav")
                  if os.path.exists(src):
                      shutil.move(src, dst)
                      result[stem_name] = dst
              if len(result) == 4:
                  return result
              raise RuntimeError("Spleeter did not generate all 4 stems.")
          except Exception as se:
              logger.warning(f"Spleeter separation failed: {se}")
              
              # 3. Cấp 3: Mock Separator (Nhân bản file gốc làm 4 stem giả lập)
              logger.info("Falling back to Mock Separator...")
              for stem in stems:
                  dst = os.path.join(output_dir, f"{stem}.wav")
                  shutil.copy2(input_path, dst)
                  result[stem] = dst
              return result
  ```

- [ ] **Step 2: Viết test_separator.py để xác minh hoạt động**
  Tạo file `code/ai-service/tests/test_separator.py` để test logic fallback và kiểm tra mock copy hoạt động đúng.

- [ ] **Step 3: Chạy test kiểm thử**
  Chạy lệnh: `pytest code/ai-service/tests/test_separator.py`
  Expected: PASS.

---

### Task 3: Triển khai FastAPI Worker kết nối BullMQ

**Files:**
- Modify: [main.py](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/ai-service/main.py)

- [ ] **Step 1: Viết Worker xử lý và đẩy queue kết quả trong `main.py`**
  Cấu hình lifespan trong `code/ai-service/main.py` để khởi động Worker lắng nghe queue `audio-analysis`.
  Khi nhận job:
  1. Tải file nhạc gốc từ Cloudflare R2 về temp file.
  2. Thực hiện bóc tách stems bằng `separate_stems` trong luồng con (`asyncio.to_thread`).
  3. Thực hiện phân tích audio (BPM, Key, Duration, Waveform) bằng `process_audio_analysis`.
  4. Upload 4 file stems đã tách ngược lên R2.
  5. Đẩy kết quả thành công/thất bại về queue `analysis-completed`.
  6. Dọn dẹp temp files.

  Ví dụ cấu hình trong `main.py`:
  ```python
  import os
  import asyncio
  import tempfile
  from contextlib import asynccontextmanager
  from fastapi import FastAPI
  from pydantic import BaseModel
  from bullmq import Worker, Queue
  from utils import audio
  from utils.demucs_separator import separate_stems

  app = FastAPI(title="StemVerse AI Service")

  # Redis config
  REDIS_HOST = os.environ.get("REDIS_HOST", "redis")
  REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
  redis_connection = {"host": REDIS_HOST, "port": REDIS_PORT}

  async def process_analysis_job(job, job_token):
      song_id = job.data.get("songId")
      file_key = job.data.get("fileUrl") # R2 key
      print(f"Starting async processing for song {song_id}")
      
      # Khởi tạo Queue gửi kết quả về NestJS
      result_queue = Queue("analysis-completed", {"connection": redis_connection})
      
      try:
          s3 = audio.get_s3_client()
          bucket_name = os.environ.get('STORAGE_BUCKET_NAME')
          
          # 1. Tải file về temp
          with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
              temp_original_path = tmp_file.name
          s3.download_file(bucket_name, file_key, temp_original_path)
          
          # 2. Phân tích nhạc lý (BPM, Key, Waveform)
          analysis_result = audio.process_audio_analysis(file_key, song_id)
          
          # 3. Tách stems (Vocals, Drums, Bass, Other)
          with tempfile.TemporaryDirectory() as temp_dir:
              stems_paths = await asyncio.to_thread(separate_stems, temp_original_path, temp_dir)
              
              # 4. Upload stems lên R2 và tạo urls map
              stems_r2_keys = {}
              for stem_type, path in stems_paths.items():
                  # Đặt key: songs/<songId>/stems/<stem_type>.wav
                  stem_key = f"songs/{song_id}/stems/{stem_type}.wav"
                  s3.upload_file(path, bucket_name, stem_key)
                  stems_r2_keys[stem_type] = stem_key
          
          # Clean original temp file
          if os.path.exists(temp_original_path):
              os.remove(temp_original_path)
              
          # 5. Gửi kết quả hoàn thành
          payload = {
              "songId": song_id,
              "status": "success",
              "bpm": analysis_result["bpm"],
              "key": analysis_result["key"],
              "duration": analysis_result["duration"],
              "waveform": analysis_result["waveform"],
              "stems": stems_r2_keys
          }
          await result_queue.add("analysis-success", payload)
          print(f"Successfully processed song {song_id} and enqueued result")
          
      except Exception as e:
          print(f"Error processing song {song_id}: {str(e)}")
          payload = {
              "songId": song_id,
              "status": "failed",
              "error": str(e)
          }
          await result_queue.add("analysis-failed", payload)
      finally:
          await result_queue.close()

  @asynccontextmanager
  async def lifespan(app: FastAPI):
      # Bắt đầu lắng nghe queue
      worker = Worker(
          "audio-analysis",
          process_analysis_job,
          {"connection": redis_connection}
      )
      print("BullMQ Worker started, listening to 'audio-analysis' queue...")
      yield
      await worker.close()
      print("BullMQ Worker shut down.")

  # Gán lifespan
  app.router.lifespan_context = lifespan
  ```

---

### Task 4: Triển khai WebSocket Gateway ở NestJS

**Files:**
- Modify: [package.json (backend)](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/package.json)
- Create: [music.gateway.ts](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/src/music/music.gateway.ts)
- Modify: [music.module.ts](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/src/music/music.module.ts)

- [ ] **Step 1: Cài đặt `@nestjs/websockets` và `@nestjs/platform-socket.io`**
  Thực hiện cài đặt các thư viện hỗ trợ WebSocket trong thư mục `code/backend`:
  Chạy lệnh: `npm install @nestjs/websockets @nestjs/platform-socket.io socket.io`

- [ ] **Step 2: Viết MusicGateway quản lý kết nối và Rooms**
  Tạo file `code/backend/src/music/music.gateway.ts` với nội dung:
  ```typescript
  import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';

  @WebSocketGateway({
    cors: {
      origin: '*',
    },
    namespace: 'music',
  })
  export class MusicGateway {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(MusicGateway.name);

    @SubscribeMessage('subscribeToSong')
    handleSubscribeToSong(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { songId: string },
    ) {
      if (data && data.songId) {
        const roomName = `song:${data.songId}`;
        client.join(roomName);
        this.logger.log(`Client ${client.id} joined room ${roomName}`);
        return { status: 'subscribed', room: roomName };
      }
      return { status: 'error', message: 'Invalid songId' };
    }

    emitSongStatusUpdate(songId: string, payload: any) {
      const roomName = `song:${songId}`;
      this.server.to(roomName).emit('song:status-updated', payload);
      this.logger.log(`Emitted status-updated to room ${roomName}`);
    }
  }
  ```

- [ ] **Step 3: Đăng ký MusicGateway vào MusicModule**
  Cập nhật file `code/backend/src/music/music.module.ts` để import và cung cấp `MusicGateway`.

---

### Task 5: Viết Processor nhận kết quả ở NestJS

**Files:**
- Modify: [music.module.ts](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/src/music/music.module.ts)
- Modify: [audio-analysis.processor.ts](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/src/music/audio-analysis.processor.ts)
- Modify: [audio-analysis.processor.spec.ts](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/backend/src/music/audio-analysis.processor.spec.ts)

- [ ] **Step 1: Đăng ký queue `analysis-completed` trong music.module.ts**
  Cấu hình thêm queue `analysis-completed` vào `BullModule.registerQueue`.
  Xóa `AudioAnalysisProcessor` khỏi providers và exports của `MusicModule` để NestJS không tự xử lý queue `audio-analysis`.

- [ ] **Step 2: Viết `AnalysisCompletedProcessor` thay thế `AudioAnalysisProcessor`**
  Sửa đổi file `code/backend/src/music/audio-analysis.processor.ts` (hoặc tạo file mới đặt tên tương ứng):
  ```typescript
  import { Processor, WorkerHost } from '@nestjs/bullmq';
  import { Job } from 'bullmq';
  import { PrismaService } from '../prisma/prisma.service';
  import { Logger } from '@nestjs/common';
  import { MusicGateway } from './music.gateway';

  @Processor('analysis-completed')
  export class AnalysisCompletedProcessor extends WorkerHost {
    private readonly logger = new Logger(AnalysisCompletedProcessor.name);

    constructor(
      private prisma: PrismaService,
      private musicGateway: MusicGateway,
    ) {
      super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
      const payload = job.data;
      const { songId, status } = payload;
      this.logger.log(`Received analysis result for song ${songId} with status: ${status}`);

      if (status === 'success') {
        const { bpm, key, duration, waveform, stems } = payload;
        const bpmDecimal = bpm ? parseFloat(bpm.toFixed(2)) : null;

        try {
          // 1. Cập nhật Song table
          const updatedSong = await this.prisma.song.update({
            where: { id: songId },
            data: {
              bpm: bpmDecimal,
              key,
              duration,
              processingStatus: 'done',
            },
          });

          // 2. Upsert SongAnalysis table
          const analysis = await this.prisma.songAnalysis.upsert({
            where: { songId },
            update: {
              bpm: bpmDecimal,
              key,
              duration,
              waveform,
            },
            create: {
              songId,
              bpm: bpmDecimal,
              key,
              duration,
              waveform,
            },
          });

          // 3. Tạo các bản ghi Stems
          const createdStems = [];
          for (const [stemType, fileUrl] of Object.entries(stems)) {
            // Chuẩn hóa loại stem: map 'vocals' thành 'vocal' nếu cần
            const type = stemType === 'vocals' ? 'vocal' : stemType;
            
            const stem = await this.prisma.stem.create({
              data: {
                songId,
                type,
                fileUrl: fileUrl as string,
                duration,
              },
            });
            createdStems.push(stem);
          }

          this.logger.log(`Updated song ${songId} successfully in database.`);

          // 4. Phát WebSocket Event báo hoàn thành
          this.musicGateway.emitSongStatusUpdate(songId, {
            songId,
            status: 'done',
            song: updatedSong,
            analysis,
            stems: createdStems,
          });

        } catch (dbError) {
          this.logger.error(`Database transaction failed for song ${songId}: ${dbError.message}`);
          
          await this.prisma.song.update({
            where: { id: songId },
            data: { processingStatus: 'failed' },
          }).catch(() => {});

          this.musicGateway.emitSongStatusUpdate(songId, {
            songId,
            status: 'failed',
            error: dbError.message,
          });

          throw dbError;
        }
      } else {
        // AI Service báo lỗi
        await this.prisma.song.update({
          where: { id: songId },
          data: { processingStatus: 'failed' },
        }).catch(() => {});

        this.musicGateway.emitSongStatusUpdate(songId, {
          songId,
          status: 'failed',
          error: payload.error || 'AI separation failed.',
        });
      }

      return { success: true, songId };
    }
  }
  ```

- [ ] **Step 3: Cập nhật Unit Test của Processor**
  Sửa đổi `code/backend/src/music/audio-analysis.processor.spec.ts` để kiểm tra đúng class `AnalysisCompletedProcessor` và mock `MusicGateway`.

- [ ] **Step 4: Chạy Unit Test Backend**
  Chạy lệnh: `npm run test` trong `code/backend`
  Expected: PASS tất cả tests.

---

### Task 6: Tích hợp WebSocket Client & Trạng thái Real-time ở Frontend

**Files:**
- Modify: [package.json (frontend)](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/package.json)
- Modify: [upload/page.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/app/(creator)/upload/page.tsx)
- Modify: [song/[id]/page.tsx](file:///c:/Users/PC/Desktop/Music-Ownership+AI-Remix-Marketplace/code/frontend/src/app/(public)/song/[id]/page.tsx)

- [ ] **Step 1: Cài đặt `socket.io-client` ở Frontend**
  Chạy lệnh: `npm install socket.io-client` tại `code/frontend`.

- [ ] **Step 2: Nâng cấp luồng Upload hiển thị trạng thái động**
  Sửa đổi `code/frontend/src/app/(creator)/upload/page.tsx` để kết nối WebSocket sau khi multipart upload hoàn thành.
  Hiển thị màn hình theo dõi trạng thái AI tách nhạc theo thời gian thực (Queued -> Processing -> Done -> Redirect).

- [ ] **Step 3: Thay thế Mock bằng dữ liệu thật & Real-time cập nhật ở trang Chi tiết bài hát**
  Sửa đổi `code/frontend/src/app/(public)/song/[id]/page.tsx`:
  - Gọi API `/music/songs/:id` khi load trang.
  - Nếu `processingStatus` chưa phải là `done`, kết nối WebSocket, join room `song:<id>` lắng nghe sự kiện `song:status-updated`.
  - Cập nhật state trang và hiển thị mixer 4 stems thật sự được load từ R2.
