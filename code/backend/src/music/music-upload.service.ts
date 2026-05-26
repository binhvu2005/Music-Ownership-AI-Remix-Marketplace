import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { R2Service } from '../prisma/r2.service';
import { PrismaService } from '../prisma/prisma.service';
import { InitUploadDto } from './dto/init-upload.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { 
  CreateMultipartUploadCommand, 
  UploadPartCommand, 
  CompleteMultipartUploadCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

interface UploadSession {
  uploadId: string;
  key: string;
  songId: string;
}

@Injectable()
export class MusicUploadService {
  // In-memory session store (development / MVP scale)
  private sessions = new Map<string, UploadSession>();

  constructor(
    private r2Service: R2Service,
    private prisma: PrismaService,
    @InjectQueue('audio-analysis') private audioAnalysisQueue: Queue,
  ) {}

  async initializeUpload(ownerId: string, dto: InitUploadDto) {
    const sessionId = crypto.randomUUID();
    const songId = crypto.randomUUID();
    
    // Define unique R2 key
    const cleanFilename = dto.filename.replace(/\s+/g, '_');
    const key = `songs/${songId}/${cleanFilename}`;
    
    // Generate public file url
    const endpoint = this.r2Service.getBucketName();
    const fileUrl = `${key}`; // Relational key path, public domain mapping will prepend R2 Domain.

    // 1. Create a placeholder Song record in database
    const song = await this.prisma.song.create({
      data: {
        id: songId,
        ownerId,
        title: dto.title,
        genre: dto.genre || 'Unknown',
        fileUrl,
        licenseType: dto.licenseType || 'personal',
        processingStatus: 'queued',
        isPublished: false,
      },
    });

    // 2. Call R2 to initiate multipart upload
    try {
      const command = new CreateMultipartUploadCommand({
        Bucket: this.r2Service.getBucketName(),
        Key: key,
        ContentType: this.getContentType(dto.filename),
      });

      const response = await this.r2Service.getS3Client().send(command);
      const uploadId = response.UploadId;

      if (!uploadId) {
        throw new Error('Failed to retrieve UploadId from Cloudflare R2');
      }

      // 3. Store session
      this.sessions.set(sessionId, { uploadId, key, songId });

      return {
        sessionId,
        songId,
        uploadId,
        key,
      };
    } catch (error) {
      // Cleanup created song if init fails
      await this.prisma.song.delete({ where: { id: songId } }).catch(() => {});
      throw new BadRequestException(`R2 Multipart Init Failed: ${error.message}`);
    }
  }

  async getPresignedUrl(sessionId: string, partNumber: number) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Upload session not found or expired');
    }

    try {
      const command = new UploadPartCommand({
        Bucket: this.r2Service.getBucketName(),
        Key: session.key,
        UploadId: session.uploadId,
        PartNumber: partNumber,
      });

      // Url expires in 1 hour
      const url = await getSignedUrl(this.r2Service.getS3Client(), command, { expiresIn: 3600 });
      return { url };
    } catch (error) {
      throw new BadRequestException(`Failed to generate Presigned URL: ${error.message}`);
    }
  }

  async completeUpload(sessionId: string, dto: CompleteUploadDto) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Upload session not found or expired');
    }

    if (session.songId !== dto.songId) {
      throw new BadRequestException('Song ID mismatch for this upload session');
    }

    try {
      // Sort parts by PartNumber as required by S3/R2 specification
      const sortedParts = [...dto.parts].sort((a, b) => a.PartNumber - b.PartNumber);

      const command = new CompleteMultipartUploadCommand({
        Bucket: this.r2Service.getBucketName(),
        Key: session.key,
        UploadId: session.uploadId,
        MultipartUpload: {
          Parts: sortedParts.map(p => ({
            PartNumber: p.PartNumber,
            ETag: p.ETag,
          })),
        },
      });

      await this.r2Service.getS3Client().send(command);

      // Clean up session
      this.sessions.delete(sessionId);

      // Update Song processing status (kept as queued, ready for worker analysis)
      await this.prisma.song.update({
        where: { id: session.songId },
        data: {
          processingStatus: 'queued',
        },
      });

      // Enqueue Job in Redis BullMQ for FastAPI analysis
      await this.audioAnalysisQueue.add('analyze-audio', {
        songId: session.songId,
        fileUrl: session.key,
      });

      return {
        success: true,
        songId: session.songId,
      };
    } catch (error) {
      throw new BadRequestException(`R2 Multipart Completion Failed: ${error.message}`);
    }
  }

  private getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'mp3') return 'audio/mpeg';
    if (ext === 'wav') return 'audio/wav';
    if (ext === 'flac') return 'audio/flac';
    return 'application/octet-stream';
  }
}
