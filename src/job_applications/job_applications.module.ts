import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';

@Module({
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
})
export class JobApplicationsModule {}
