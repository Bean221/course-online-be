// // src/payments/payments.module.ts
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { PaymentService } from '../payments/payments.service';
// import { PaymentController } from '../payments/payments.controller';
// import { PrismaService } from '../prisma/prisma.service';
// import { MailService } from '../mail/mail.service';
// import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
// import { RawBodyMiddleware } from '../middlewares/raw-body.middleware'; // Điều chỉnh đường dẫn
// @Module({
//   imports: [ConfigModule],
//   providers: [PaymentService, PrismaService, MailService],
//   controllers: [PaymentController],
// })
// export class PaymentsModule implements NestModule {
//   // Hoặc tên module của bạn implements NestModule
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(RawBodyMiddleware)
//       .forRoutes({ path: 'payments/webhook', method: RequestMethod.POST }); // Áp dụng chỉ cho POST /payments/webhook
//   }
// }
