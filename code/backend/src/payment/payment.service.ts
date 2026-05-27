import { Injectable, BadRequestException, NotFoundException, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PaymentService {
  private stripe: any;
  private webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_API_KEY') || 'sk_test_xxx';
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'whsec_xxx';
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any, // Bypass TS error if mismatching
    });
  }

  async createPaymentIntent(songId: string, licenseType: 'commercial' | 'remix' | 'exclusive', userId: string) {
    const songConfig = await this.prisma.songLicenseConfig.findUnique({
      where: { songId },
    });

    if (!songConfig) {
      throw new NotFoundException(`License config not found for song ${songId}`);
    }

    let price = 0;
    let enabled = false;

    switch (licenseType) {
      case 'commercial':
        price = songConfig.commercialPrice;
        enabled = songConfig.commercialEnabled;
        break;
      case 'remix':
        price = songConfig.remixPrice;
        enabled = songConfig.remixEnabled;
        break;
      case 'exclusive':
        price = songConfig.exclusivePrice;
        enabled = songConfig.exclusiveEnabled;
        break;
    }

    if (!enabled) {
      throw new BadRequestException(`License type ${licenseType} is not enabled or available for this song`);
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      metadata: {
        songId,
        userId,
        licenseType,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleWebhook(body: Buffer, signature: string): Promise<boolean> {
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, this.webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const { songId, userId, licenseType } = paymentIntent.metadata;

      // Idempotency Check
      const existingLicense = await this.prisma.userLicense.findUnique({
        where: { paymentId: paymentIntent.id },
      });

      if (existingLicense) {
        return true; // Already processed
      }

      await this.prisma.$transaction(async (tx) => {
        // Create License
        const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
        const shortSong = songId.substring(0, 4).toUpperCase();
        const licenseKey = `STMV-${shortSong}-${licenseType.substring(0, 4).toUpperCase()}-${randomStr}`;

        await tx.userLicense.create({
          data: {
            userId,
            songId,
            licenseType: licenseType as any,
            licenseKey,
            pricePaid: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            paymentId: paymentIntent.id,
          },
        });

        // If exclusive, disable future exclusive sales
        if (licenseType === 'exclusive') {
          await tx.songLicenseConfig.update({
            where: { songId },
            data: { exclusiveEnabled: false },
          });
        }
      });
    }

    return true;
  }
}
