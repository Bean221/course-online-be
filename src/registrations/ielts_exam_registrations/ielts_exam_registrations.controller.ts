import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IeltsExamRegistrationsService } from './ielts_exam_registrations.service';
import { CreateIeltsExamRegistrationDto } from './dto/create-ielts_exam_registration.dto';
import { UpdateIeltsExamRegistrationDto } from './dto/update-ielts_exam_registration.dto';

@Controller('ielts-exam-registrations')
export class IeltsExamRegistrationsController {
  constructor(private readonly ieltsExamRegistrationsService: IeltsExamRegistrationsService) {}

  @Post()
  create(@Body() createIeltsExamRegistrationDto: CreateIeltsExamRegistrationDto) {
    return this.ieltsExamRegistrationsService.create(createIeltsExamRegistrationDto);
  }

  @Get()
  findAll() {
    return this.ieltsExamRegistrationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ieltsExamRegistrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIeltsExamRegistrationDto: UpdateIeltsExamRegistrationDto) {
    return this.ieltsExamRegistrationsService.update(+id, updateIeltsExamRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ieltsExamRegistrationsService.remove(+id);
  }
}
