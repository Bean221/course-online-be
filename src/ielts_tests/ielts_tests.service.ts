import { Injectable } from '@nestjs/common';
import { CreateIeltsTestDto } from './dto/create-ielts_test.dto';
import { UpdateIeltsTestDto } from './dto/update-ielts_test.dto';

@Injectable()
export class IeltsTestsService {
  create(createIeltsTestDto: CreateIeltsTestDto) {
    return 'This action adds a new ieltsTest';
  }

  findAll() {
    return `This action returns all ieltsTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ieltsTest`;
  }

  update(id: number, updateIeltsTestDto: UpdateIeltsTestDto) {
    return `This action updates a #${id} ieltsTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} ieltsTest`;
  }
}
