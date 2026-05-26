import { Test, TestingModule } from '@nestjs/testing';
import { AudioAnalysisProcessor } from './audio-analysis.processor';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';

describe('AudioAnalysisProcessor', () => {
  let processor: AudioAnalysisProcessor;
  let prisma: PrismaService;

  const mockPrisma = {
    song: {
      update: jest.fn(),
    },
    songAnalysis: {
      upsert: jest.fn(),
    },
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'AI_SERVICE_URL') return 'http://localhost:8000';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioAnalysisProcessor,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    processor = module.get<AudioAnalysisProcessor>(AudioAnalysisProcessor);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should successfully analyze audio and save results to db', async () => {
      const mockJob = {
        data: {
          songId: 'song-uuid',
          fileUrl: 'songs/song-uuid/test.mp3',
        },
      } as Job;

      // Mock global fetch API
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          songId: 'song-uuid',
          bpm: 120,
          key: 'Am',
          duration: 180,
          waveform: [0.012, 0.045, 0.098],
        }),
      };
      global.fetch = jest.fn().mockResolvedValue(mockFetchResponse);

      mockPrisma.song.update.mockResolvedValue({ id: 'song-uuid' });
      mockPrisma.songAnalysis.upsert.mockResolvedValue({ id: 'analysis-uuid' });

      const result = await processor.process(mockJob);

      expect(result).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/analyze',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            songId: 'song-uuid',
            fileUrl: 'songs/song-uuid/test.mp3',
          }),
        }),
      );

      // Verify DB writes
      expect(prisma.songAnalysis.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { songId: 'song-uuid' },
          create: expect.objectContaining({
            songId: 'song-uuid',
            bpm: 120,
            key: 'Am',
            duration: 180,
          }),
        }),
      );

      expect(prisma.song.update).toHaveBeenCalledWith({
        where: { id: 'song-uuid' },
        data: {
          bpm: 120,
          key: 'Am',
          duration: 180,
          processingStatus: 'done',
        },
      });
    });

    it('should update status to failed if FastAPI analysis fails', async () => {
      const mockJob = {
        data: {
          songId: 'song-uuid',
          fileUrl: 'songs/song-uuid/test.mp3',
        },
      } as Job;

      // Mock fetch failure
      global.fetch = jest.fn().mockRejectedValue(new Error('FastAPI offline'));
      mockPrisma.song.update.mockResolvedValue({ id: 'song-uuid' });

      await expect(processor.process(mockJob)).rejects.toThrow('FastAPI offline');

      expect(prisma.song.update).toHaveBeenCalledWith({
        where: { id: 'song-uuid' },
        data: {
          processingStatus: 'failed',
        },
      });
    });
  });
});
