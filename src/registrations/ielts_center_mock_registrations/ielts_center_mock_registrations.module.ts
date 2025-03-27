import { Module } from '@nestjs/common';
import { IeltsCenterMockRegistrationsService } from './ielts_center_mock_registrations.service';
import { IeltsCenterMockRegistrationsController } from './ielts_center_mock_registrations.controller';

@Module({
  controllers: [IeltsCenterMockRegistrationsController],
  providers: [IeltsCenterMockRegistrationsService],
})
export class IeltsCenterMockRegistrationsModule {}
