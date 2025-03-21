import { Body, Controller, Post } from '@nestjs/common';
import { users } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() body: RegisterDto): Promise<users> {
    return this.authService.register(body);
  }
  @Post('login')
  login(@Body() body: LoginDto): Promise<any> {
    return this.authService.login(body);
  }
}
