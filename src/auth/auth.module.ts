import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '1234512345',
      signOptions: { expiresIn: '1000d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465, // hoặc 465 nếu dùng SSL
        secure: true, // true nếu dùng port 465
        auth: {
          user: process.env.GMAIL_USER, // Ví dụ: your-email@gmail.com
          pass: process.env.GMAIL_PASS, // Mật khẩu ứng dụng Gmail của bạn
        },
      },
      defaults: {
        from: '"No Reply" <tuan.leminh@ncc.asia>',
      },
      template: {
        dir: join(process.cwd(), 'src/auth/templates'), // Đảm bảo file template nằm trong thư mục này
        adapter: new HandlebarsAdapter(), // sử dụng Handlebars
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
