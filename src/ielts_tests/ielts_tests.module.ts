import { Module } from '@nestjs/common';
import { IeltsTestsController } from './ielts_tests.controller';
import { IeltsTestsService } from './ielts_tests.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IeltsTestsController],
  providers: [IeltsTestsService],
})
export class IeltsTestsModule {}
