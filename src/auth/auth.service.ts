import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
// Giả sử bạn có mailer service (có thể dùng nodemailer), dưới đây chỉ mô phỏng
// import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Remove password from the result before returning
      return { ...user, password: undefined };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    };
    return {
      user,
      token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.register(registerDto);
    const payload = {
      sub: String(user.user.id),
      email: String(user.user.email),
    };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  logout() {
    // Với JWT, logout chủ yếu xử lý trên FE
    return { message: 'Logged out successfully' };
  }

  // Forgot Password: Tạo token, lưu vào user và gửi email
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { sub: String(user.id), email: user.email };
    // Tạo reset token, có thời gian hết hạn ngắn (ví dụ 15 phút)
    const resetToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Ví dụ về resetLink: có thể là URL của front-end chứa trang đặt lại mật khẩu
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Gửi email sử dụng template "forgot-password.hbs"
    await this.mailerService.sendMail({
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      template: './forgot-password', // Tương ứng với file forgot-password.hbs
      context: {
        name: user.full_name || 'User',
        resetLink,
      },
    });

    return {
      message:
        'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
    };
  }

  // Reset Password: Xác thực token và cập nhật mật khẩu mới
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;
    interface JwtPayload {
      sub: string;
      email: string;
      iat?: number;
      exp?: number;
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token); // Giải mã token reset
    } catch {
      throw new BadRequestException('Reset token không hợp lệ hoặc đã hết hạn');
    }

    // payload phải chứa trường sub (user id)
    const userId = Number(payload.sub);
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  // đổi mk
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    console.log('UserId:', userId);
    console.log('currentPassword:', currentPassword);
    console.log('newPassword:', newPassword);

    const user = await this.prisma.users.findUnique({
      where: {
        id: Number(userId), // chuyển đổi sang số
      },
    });
    if (!user) {
      console.error('User not found for id:', userId);
      throw new NotFoundException('User not found');
    }

    console.log('User password hash:', user.password);

    if (!user.password) {
      throw new BadRequestException('User password is not set');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.users.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
