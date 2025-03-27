import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IeltsMockRegistrationsService } from './ielts_mock_registrations.service';
import { CreateIeltsMockRegistrationDto } from './dto/create-ielts_mock_registration.dto';
import { UpdateIeltsMockRegistrationDto } from './dto/update-ielts_mock_registration.dto';

@Controller('ielts-mock-registrations')
export class IeltsMockRegistrationsController {
  constructor(private readonly ieltsMockRegistrationsService: IeltsMockRegistrationsService) {}

  @Post()
  create(@Body() createIeltsMockRegistrationDto: CreateIeltsMockRegistrationDto) {
    return this.ieltsMockRegistrationsService.create(createIeltsMockRegistrationDto);
  }

  @Get()
  findAll() {
    return this.ieltsMockRegistrationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ieltsMockRegistrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIeltsMockRegistrationDto: UpdateIeltsMockRegistrationDto) {
    return this.ieltsMockRegistrationsService.update(+id, updateIeltsMockRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ieltsMockRegistrationsService.remove(+id);
  }
}
