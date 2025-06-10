import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { sub: number };
}

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}
  async createRegistration(
    @Body() dto: CreateRegistrationDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException();
    }
    return this.registrationService.createRegistration(req.user.sub, dto);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getRegistrations(@Req() req: RequestWithUser) {
    if (!req.user?.sub) {
      throw new UnauthorizedException();
    }
    return this.registrationService.getUserRegistrations(req.user.sub);
  }
}
