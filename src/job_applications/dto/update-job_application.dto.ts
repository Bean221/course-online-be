import { PartialType } from '@nestjs/mapped-types';
import { CreateJobApplicationDto } from './create-job_application.dto';

export class UpdateJobApplicationDto extends PartialType(CreateJobApplicationDto) {}
