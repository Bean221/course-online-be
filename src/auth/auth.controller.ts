import { Body, Controller, Post } from '@nestjs/common';
import { users } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() body: RegisterDto): Promise<users> {
    return this.authService.register(body);
  }
}
