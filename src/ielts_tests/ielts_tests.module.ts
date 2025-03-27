import { Module } from '@nestjs/common';
import { IeltsTestsService } from './ielts_tests.service';
import { IeltsTestsController } from './ielts_tests.controller';

@Module({
  controllers: [IeltsTestsController],
  providers: [IeltsTestsService],
})
export class IeltsTestsModule {}
