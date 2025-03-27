import { Injectable } from '@nestjs/common';
import { CreateIeltsExamRegistrationDto } from './dto/create-ielts_exam_registration.dto';
import { UpdateIeltsExamRegistrationDto } from './dto/update-ielts_exam_registration.dto';

@Injectable()
export class IeltsExamRegistrationsService {
  create(createIeltsExamRegistrationDto: CreateIeltsExamRegistrationDto) {
    return 'This action adds a new ieltsExamRegistration';
  }

  findAll() {
    return `This action returns all ieltsExamRegistrations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ieltsExamRegistration`;
  }

  update(id: number, updateIeltsExamRegistrationDto: UpdateIeltsExamRegistrationDto) {
    return `This action updates a #${id} ieltsExamRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} ieltsExamRegistration`;
  }
}
