import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentsModule {}
