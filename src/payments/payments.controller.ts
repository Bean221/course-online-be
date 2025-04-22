import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPaymentLink(@Body('registrationId') registrationId: number) {
    return this.paymentsService.createPaymentLink(registrationId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(body);
  }
}
