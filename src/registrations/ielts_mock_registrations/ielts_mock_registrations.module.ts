import { Module } from '@nestjs/common';
import { IeltsMockRegistrationsService } from './ielts_mock_registrations.service';
import { IeltsMockRegistrationsController } from './ielts_mock_registrations.controller';

@Module({
  controllers: [IeltsMockRegistrationsController],
  providers: [IeltsMockRegistrationsService],
})
export class IeltsMockRegistrationsModule {}
