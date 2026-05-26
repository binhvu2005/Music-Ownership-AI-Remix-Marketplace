import { Module } from '@nestjs/common';
import { MusicUploadService } from './music-upload.service';
import { MusicUploadController } from './music-upload.controller';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { BullModule } from '@nestjs/bullmq';
import { AudioAnalysisProcessor } from './audio-analysis.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-analysis',
    }),
  ],
  controllers: [MusicUploadController, MusicController],
  providers: [MusicUploadService, MusicService, AudioAnalysisProcessor],
  exports: [MusicUploadService, MusicService, AudioAnalysisProcessor],
})
export class MusicModule {}
