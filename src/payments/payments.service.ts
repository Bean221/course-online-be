import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service'; // Giả định bạn đã có MailService

@Injectable()
export class PaymentService {
  private payos: PayOS;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {
    this.payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async createPaymentLink(data: {
    fullName: string;
    email: string;
    studentId: string;
    testDate: string;
  }) {
    const orderCode = Date.now(); // Mã đơn hàng duy nhất
    const amount = 100000; // 100,000 VND

    const paymentData = {
      orderCode,
      amount,
      description: `Thanh toán phí thi thử IELTS cho ${data.fullName}`,
      returnUrl: 'http://localhost:3000/registration/success', // URL sau khi thanh toán thành công
      cancelUrl: 'http://localhost:3000/registration/cancel', // URL khi hủy thanh toán
    };

    const paymentLink = await this.payos.createPaymentLink(paymentData);

    // Lưu thông tin giao dịch vào database
    await this.prisma.transaction.create({
      data: {
        orderCode: orderCode.toString(),
        amount,
        status: 'PENDING',
        fullName: data.fullName,
        email: data.email,
        studentId: data.studentId,
        testDate: data.testDate,
      },
    });

    return paymentLink.checkoutUrl;
  }

  async handlePaymentCallback(body: any) {
    const { orderCode, status } = body;

    // Xác minh thanh toán với PayOS
    const paymentInfo = await this.payos.getPaymentLinkInformation(orderCode);
    if (paymentInfo.status !== status)
      throw new Error('Invalid payment status');

    // Cập nhật trạng thái giao dịch
    const transaction = await this.prisma.transaction.update({
      where: { orderCode: orderCode.toString() },
      data: { status: status === 'PAID' ? 'COMPLETED' : 'FAILED' },
    });

    // Gửi email xác nhận nếu thanh toán thành công
    if (status === 'PAID') {
      await this.mailService.sendMail({
        to: transaction.email,
        subject: 'Xác nhận đăng ký thi thử IELTS',
        text: `Chào ${transaction.fullName},\n\nĐăng ký của bạn cho ngày ${transaction.testDate} đã được xác nhận. Cảm ơn bạn đã thanh toán ${transaction.amount} VND.\n\nTrân trọng,\nĐội ngũ IELTS`,
      });
    }

    return transaction;
  }
}
