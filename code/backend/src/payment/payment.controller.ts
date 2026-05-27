import { Controller, Post, Body, Req, UseGuards, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  async createIntent(
    @Body('songId') songId: string,
    @Body('licenseType') licenseType: 'commercial' | 'remix' | 'exclusive',
    @Req() req: any,
  ) {
    return this.paymentService.createPaymentIntent(songId, licenseType, req.user.userId);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'];
    
    if (!signature || !req.rawBody) {
      return { received: false, error: 'Missing rawBody or signature' };
    }

    await this.paymentService.handleWebhook(req.rawBody, signature as string);
    
    return { received: true };
  }
}
