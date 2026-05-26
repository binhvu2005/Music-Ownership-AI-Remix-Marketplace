import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Processor('audio-analysis')
export class AudioAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AudioAnalysisProcessor.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { songId, fileUrl } = job.data;
    this.logger.log(`Starting audio analysis job for song ${songId}...`);

    // Update song status to 'processing'
    await this.prisma.song.update({
      where: { id: songId },
      data: { processingStatus: 'processing' },
    });

    const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';

    try {
      // Call FastAPI microservice to analyze audio
      const response = await fetch(`${aiServiceUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId, fileUrl }),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned status ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();

      const bpmDecimal = result.bpm ? parseFloat(result.bpm.toFixed(2)) : null;

      // 1. Save detail analysis to song_analysis table
      await this.prisma.songAnalysis.upsert({
        where: { songId },
        update: {
          bpm: bpmDecimal,
          key: result.key,
          duration: result.duration,
          waveform: result.waveform, // Store waveform float array JSON
        },
        create: {
          songId,
          bpm: bpmDecimal,
          key: result.key,
          duration: result.duration,
          waveform: result.waveform,
        },
      });

      // 2. Update metadata cache on core Song table and set status to 'done'
      await this.prisma.song.update({
        where: { id: songId },
        data: {
          bpm: bpmDecimal,
          key: result.key,
          duration: result.duration,
          processingStatus: 'done',
        },
      });

      this.logger.log(`Audio analysis completed successfully for song ${songId}`);
      return { success: true, songId };
    } catch (error) {
      this.logger.error(`Failed to analyze audio for song ${songId}: ${error.message}`);
      
      // Update status to failed in database
      await this.prisma.song.update({
        where: { id: songId },
        data: { processingStatus: 'failed' },
      }).catch(() => {});

      throw error; // Re-throw to fail the BullMQ job so it can retry
    }
  }
}
