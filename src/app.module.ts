import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AuthModule], // Các module khác nếu có thể được import ở đây
  controllers: [AppController], // Đăng ký controller
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ], // Đăng ký service
})
export class AppModule {}
