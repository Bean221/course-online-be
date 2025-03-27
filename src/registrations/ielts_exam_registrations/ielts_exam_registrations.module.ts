import { Module } from '@nestjs/common';
import { IeltsExamRegistrationsService } from './ielts_exam_registrations.service';
import { IeltsExamRegistrationsController } from './ielts_exam_registrations.controller';

@Module({
  controllers: [IeltsExamRegistrationsController],
  providers: [IeltsExamRegistrationsService],
})
export class IeltsExamRegistrationsModule {}
