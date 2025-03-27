import { Injectable } from '@nestjs/common';
import { CreateIeltsMockRegistrationDto } from './dto/create-ielts_mock_registration.dto';
import { UpdateIeltsMockRegistrationDto } from './dto/update-ielts_mock_registration.dto';

@Injectable()
export class IeltsMockRegistrationsService {
  create(createIeltsMockRegistrationDto: CreateIeltsMockRegistrationDto) {
    return 'This action adds a new ieltsMockRegistration';
  }

  findAll() {
    return `This action returns all ieltsMockRegistrations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ieltsMockRegistration`;
  }

  update(id: number, updateIeltsMockRegistrationDto: UpdateIeltsMockRegistrationDto) {
    return `This action updates a #${id} ieltsMockRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} ieltsMockRegistration`;
  }
}
