import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IeltsCenterMockRegistrationsService } from './ielts_center_mock_registrations.service';
import { CreateIeltsCenterMockRegistrationDto } from './dto/create-ielts_center_mock_registration.dto';
import { UpdateIeltsCenterMockRegistrationDto } from './dto/update-ielts_center_mock_registration.dto';

@Controller('ielts-center-mock-registrations')
export class IeltsCenterMockRegistrationsController {
  constructor(private readonly ieltsCenterMockRegistrationsService: IeltsCenterMockRegistrationsService) {}

  @Post()
  create(@Body() createIeltsCenterMockRegistrationDto: CreateIeltsCenterMockRegistrationDto) {
    return this.ieltsCenterMockRegistrationsService.create(createIeltsCenterMockRegistrationDto);
  }

  @Get()
  findAll() {
    return this.ieltsCenterMockRegistrationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ieltsCenterMockRegistrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIeltsCenterMockRegistrationDto: UpdateIeltsCenterMockRegistrationDto) {
    return this.ieltsCenterMockRegistrationsService.update(+id, updateIeltsCenterMockRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ieltsCenterMockRegistrationsService.remove(+id);
  }
}
