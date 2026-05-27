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
          // Chuẩn hóa loại stem: map 'vocals' thành 'vocal' để tương thích với db comment
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
