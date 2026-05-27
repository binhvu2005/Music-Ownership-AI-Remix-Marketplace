import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { LicensingService } from './licensing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('licenses')
export class LicensingController {
  constructor(private readonly licensingService: LicensingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyLicenses(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.licensingService.findMyLicenses(userId);
  }

  @Get('songs/:songId/options')
  async getOptions(@Param('songId') songId: string) {
    return this.licensingService.getLicenseOptions(songId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('songs/:songId/config')
  async updateConfig(
    @Param('songId') songId: string,
    @Req() req: any,
    @Body() dto: any,
  ) {
    const ownerId = req.user.userId || req.user.id;
    return this.licensingService.updateLicenseConfig(songId, ownerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase-free')
  async purchaseFree(
    @Body('songId') songId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId || req.user.id;
    return this.licensingService.purchaseFreeLicense(songId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate/:songId')
  async validate(
    @Param('songId') songId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId || req.user.id;
    const isValid = await this.licensingService.validateLicense(songId, userId);
    return { isValid };
  }
}
