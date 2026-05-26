import { Module } from '@nestjs/common';
import { MusicUploadService } from './music-upload.service';
import { MusicUploadController } from './music-upload.controller';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

@Module({
  controllers: [MusicUploadController, MusicController],
  providers: [MusicUploadService, MusicService],
  exports: [MusicUploadService, MusicService],
})
export class MusicModule {}
