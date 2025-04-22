import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async createRegistration(userId: number, data: any) {
    const {
      examType,
      testDate,
      location,
      format,
      fullName,
      dob,
      gender,
      phone,
      email,
      cccd,
      residence,
    } = data;
    const amount = examType === 'Thi Thử' ? 100000 : 5000000;

    const registration = await this.prisma.registration.create({
      data: {
        userId,
        examType,
        selectedDate: new Date(testDate),
        location,
        format,
        fullName,
        dob: new Date(dob),
        gender,
        phone,
        email,
        cccd,
        residence,
        price: amount,
        status: 'PENDING',
      },
    });

    const paymentResponse = await this.paymentsService.createPaymentLink(
      registration.id,
    );
    return paymentResponse;
  }
}
