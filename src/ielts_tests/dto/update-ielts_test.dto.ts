import { PartialType } from '@nestjs/mapped-types';
import { CreateIeltsTestDto } from './create-ielts_test.dto';

export class UpdateIeltsTestDto extends PartialType(CreateIeltsTestDto) {}
