import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Body()
    body: {
      fullName: string;
      email: string;
      studentId: string;
      testDate: string;
    },
  ) {
    const paymentUrl = await this.paymentService.createPaymentLink(body);
    return { paymentUrl };
  }

  @Post('callback')
  async handleCallback(@Body() body: any) {
    const result = await this.paymentService.handlePaymentCallback(body);
    return result;
  }
}
