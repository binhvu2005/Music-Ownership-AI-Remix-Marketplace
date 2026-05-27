import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RoyaltyService } from './royalty.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('royalty')
@UseGuards(JwtAuthGuard)
export class RoyaltyController {
  constructor(private royaltyService: RoyaltyService) {}

  @Get('wallet')
  async getWallet(@Req() req: any) {
    const userId = req.user.id;
    return this.royaltyService.getWallet(userId);
  }

  @Get('transactions')
  async getTransactions(@Req() req: any) {
    const userId = req.user.id;
    return this.royaltyService.getTransactions(userId);
  }
}
