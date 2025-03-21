import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { users } from '.prisma/client';
import { hash } from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  register = async (userData: RegisterDto): Promise<users> => {
    // check email
    const user = await this.prismaService.users.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new HttpException(
        { massage: 'This email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // tạo user // hash data
    const hashPassword = await hash(userData.password, 10);
    const res = await this.prismaService.users.create({
      data: {
        ...userData,
        password: hashPassword,
      },
    });
    return res;
  };
}
