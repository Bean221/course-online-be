import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { users } from '.prisma/client';
import { hash, compare } from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  // login
  login = async (data: { email: string; password: string }): Promise<any> => {
    // buoc 1 check user có tồn lại không
    const user = await this.prismaService.users.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new HttpException(
        { massage: 'Account is not exist.' },
        HttpStatus.UNAUTHORIZED,
      );
      //buoc 2 check password đúng chưa
    }
    // check password đã set chưa
    if (!user.password) {
      throw new HttpException(
        { message: 'User password is not set' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const verify = await compare(data.password, user.password); // có thể null ở user.password
    if (!verify) {
      throw new HttpException(
        { massage: 'Password is wrong' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // buoc 3 trả về token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
    };
  };
}
