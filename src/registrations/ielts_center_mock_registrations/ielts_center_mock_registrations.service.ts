import { Injectable } from '@nestjs/common';
import { CreateIeltsCenterMockRegistrationDto } from './dto/create-ielts_center_mock_registration.dto';
import { UpdateIeltsCenterMockRegistrationDto } from './dto/update-ielts_center_mock_registration.dto';

@Injectable()
export class IeltsCenterMockRegistrationsService {
  create(createIeltsCenterMockRegistrationDto: CreateIeltsCenterMockRegistrationDto) {
    return 'This action adds a new ieltsCenterMockRegistration';
  }

  findAll() {
    return `This action returns all ieltsCenterMockRegistrations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ieltsCenterMockRegistration`;
  }

  update(id: number, updateIeltsCenterMockRegistrationDto: UpdateIeltsCenterMockRegistrationDto) {
    return `This action updates a #${id} ieltsCenterMockRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} ieltsCenterMockRegistration`;
  }
}
