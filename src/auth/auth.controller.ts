import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    if (!forgotPasswordDto || typeof forgotPasswordDto.email !== 'string') {
      throw new Error('Invalid input: email must be a string');
    }
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Request() req: { user: { id: number } },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // req.user sẽ chứa thông tin user, ví dụ: { id: 1, email: ... }
    const userId = req.user.id;
    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
