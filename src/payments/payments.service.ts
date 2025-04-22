import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PayOS from '@payos/node';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentsService {
  private payos: PayOS;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {
    if (
      !process.env.PAYOS_CLIENT_ID ||
      !process.env.PAYOS_API_KEY ||
      !process.env.PAYOS_CHECKSUM_KEY
    ) {
      throw new Error('PayOS environment variables are not configured');
    }
    this.payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async createPaymentLink(registrationId: number) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    const orderCode = Date.now();
    const paymentData = {
      orderCode,
      amount: Number(registration.price),
      description: `Thanh toán phí thi ${registration.examType} cho ${registration.fullName}`,
      returnUrl: 'http://localhost:3000/registration/success',
      cancelUrl: 'http://localhost:3000/registration/cancel',
    };

    const paymentLink = await this.payos.createPaymentLink(paymentData);

    await this.prisma.payment.create({
      data: {
        registrationId,
        payosOrderId: orderCode.toString(),
        amount: registration.price,
        status: 'PENDING',
        paymentMethod: 'PAYOS',
      },
    });

    return { paymentUrl: paymentLink.checkoutUrl };
  }

  async handleWebhook(webhookData: any) {
    const { orderCode, status } = webhookData;

    const paymentInfo = await this.payos.getPaymentLinkInformation(orderCode);
    if (paymentInfo.status !== status)
      throw new Error('Invalid payment status');

    const payment = await this.prisma.payment.update({
      where: { payosOrderId: orderCode.toString() },
      data: {
        status: status === 'PAID' ? 'SUCCESS' : 'FAILED',
        paymentDate: new Date(),
      },
    });

    const registration = await this.prisma.registration.update({
      where: { id: payment.registrationId },
      data: { status: status === 'PAID' ? 'PAID' : 'CANCELLED' },
    });

    if (status === 'PAID') {
      await this.mailService.sendMail({
        to: registration.email,
        subject: 'Xác nhận đăng ký thi IELTS',
        text: `Chào ${registration.fullName},\n\nĐăng ký của bạn cho kỳ thi ${registration.examType} vào ngày ${registration.selectedDate.toLocaleDateString()} đã được xác nhận. Cảm ơn bạn đã thanh toán ${registration.price} VND.\n\nTrân trọng,\nĐội ngũ IELTS`,
      });
    }

    return { success: true };
  }
}
