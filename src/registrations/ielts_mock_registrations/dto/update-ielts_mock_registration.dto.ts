import { PartialType } from '@nestjs/mapped-types';
import { CreateIeltsMockRegistrationDto } from './create-ielts_mock_registration.dto';

export class UpdateIeltsMockRegistrationDto extends PartialType(CreateIeltsMockRegistrationDto) {}
