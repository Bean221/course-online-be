import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';
// Giả sử bạn có mailer service (có thể dùng nodemailer), dưới đây chỉ mô phỏng
// import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private mailerService: MailerService,
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
    const payload = { sub: String(user.id), email: user.email };
    return {
      user,
      token: this.jwtService.sign(payload),
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
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Tạo token (ở đây dùng randomBytes, bạn cũng có thể dùng JWT)
    const resetToken = randomBytes(32).toString('hex');
    // Lưu token vào user (reset_token)
    await this.usersService.setResetToken(email, resetToken);
    // Gửi email cho user với token này
    // Ví dụ: gửi link reset mật khẩu: http://frontend-url/reset-password?token=resetToken
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Reset your password',
    //   text: `Please use the following link to reset your password: http://localhost:3001/reset-password?token=${resetToken}`,
    // });
    // Để demo, ta chỉ trả về token (trong production không trả về)
    return { message: 'Reset token generated and email sent', resetToken };
  }

  // Reset Password: Xác thực token và cập nhật mật khẩu mới
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, new_password } = resetPasswordDto;
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    // Cập nhật mật khẩu mới và xóa reset_token
    return this.usersService.updatePassword(user.id, new_password);
  }
}
