import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule], // Các module khác nếu có thể được import ở đây
  controllers: [AppController], // Đăng ký controller
  providers: [AppService], // Đăng ký service
})
export class AppModule {}
