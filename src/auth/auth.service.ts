import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { role_enum } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Đăng ký
  async register(registerDto: RegisterDto) {
    const { full_name, email, password, phone, role } = registerDto;
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.users.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        phone,
        role: role || role_enum.student, // Mặc định là 'student'
        created_at: new Date(),
      },
    });
    return { message: 'Đăng ký thành công' };
  }

  // Đăng nhập
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password || ''))) {
      throw new BadRequestException('Thông tin đăng nhập không đúng');
    }
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Quên mật khẩu
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const resetToken = Math.random().toString(36).slice(2);
    await this.prisma.users.update({
      where: { email },
      data: { reset_token: resetToken },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Khôi phục mật khẩu',
      text: `Nhấp vào liên kết để đặt lại mật khẩu: http://localhost:5173/reset-password?token=${resetToken}`,
    };
    await transporter.sendMail(mailOptions);
    return { message: 'Liên kết khôi phục mật khẩu đã được gửi qua email' };
  }

  // Khôi phục mật khẩu
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, new_password } = resetPasswordDto;
    const user = await this.prisma.users.findFirst({
      where: { reset_token: token },
    });
    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword, reset_token: null },
    });
    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
