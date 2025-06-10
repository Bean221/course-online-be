import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

// app.module.ts
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { IeltsTestsModule } from './ielts_tests/ielts_tests.module';

@Module({
  imports: [
    IeltsTestsModule,
    UsersModule,
    IeltsTestsModule,
    AuthModule,
    ConfigModule.forRoot(),
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ConfigService],
  exports: [PrismaService],
})
export class AppModule {}
