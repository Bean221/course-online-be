import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: 'http://localhost:5173', // ví dụ FE chạy trên port 3001
    credentials: true,
  });

  // Bật ValidationPipe để tự động validate request từ FE
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get<string>('PORT') || '3000';
  await app.listen(port);
}
bootstrap();
