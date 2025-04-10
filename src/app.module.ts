import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

// app.module.ts
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { IeltsTestsModule } from './ielts_tests/ielts_tests.module';
import { PaymentsModule } from './payments/payments.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';

@Module({
  imports: [
    IeltsTestsModule,
    UsersModule,
    CoursesModule,
    IeltsTestsModule,
    PaymentsModule,
    ConsultationsModule,
    JobApplicationsModule,
    AuthModule,
    ConfigModule.forRoot(),
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ConfigService],
  exports: [PrismaService],
})
export class AppModule {}
