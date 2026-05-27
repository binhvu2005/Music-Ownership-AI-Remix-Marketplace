import { Module } from '@nestjs/common';
import { MusicUploadService } from './music-upload.service';
import { MusicUploadController } from './music-upload.controller';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisCompletedProcessor } from './audio-analysis.processor';
import { MusicGateway } from './music.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-analysis',
    }),
    BullModule.registerQueue({
      name: 'analysis-completed',
    }),
  ],
  controllers: [MusicUploadController, MusicController],
  providers: [MusicUploadService, MusicService, AnalysisCompletedProcessor, MusicGateway],
  exports: [MusicUploadService, MusicService, AnalysisCompletedProcessor, MusicGateway],
})
export class MusicModule {}
