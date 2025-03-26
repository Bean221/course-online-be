// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Tạo ứng dụng NestJS từ AppModule
  const app = await NestFactory.create(AppModule);
  // Cho phép CORS (nếu cần cho FE)
  app.enableCors();
  await app.listen(3000);
  console.log('Server chạy trên cổng 3000');
}
bootstrap();
