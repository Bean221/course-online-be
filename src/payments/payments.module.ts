import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
