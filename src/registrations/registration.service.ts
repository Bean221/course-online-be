import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async createRegistration(userId: number, dto: CreateRegistrationDto) {
    return this.prisma.registration.create({
      data: {
        userId,
        ...dto,
        status: 'pending',
      },
    });
  }

  async getUserRegistrations(userId: number) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: { payments: true },
    });
  }
}
