import { PartialType } from '@nestjs/mapped-types';
import { CreateIeltsCenterMockRegistrationDto } from './create-ielts_center_mock_registration.dto';

export class UpdateIeltsCenterMockRegistrationDto extends PartialType(CreateIeltsCenterMockRegistrationDto) {}
