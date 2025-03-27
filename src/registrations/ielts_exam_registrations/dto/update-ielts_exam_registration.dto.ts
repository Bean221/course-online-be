import { PartialType } from '@nestjs/mapped-types';
import { CreateIeltsExamRegistrationDto } from './create-ielts_exam_registration.dto';

export class UpdateIeltsExamRegistrationDto extends PartialType(CreateIeltsExamRegistrationDto) {}
