import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IeltsTestsService } from './ielts_tests.service';
import { CreateIeltsTestDto } from './dto/create-ielts_test.dto';
import { UpdateIeltsTestDto } from './dto/update-ielts_test.dto';

@Controller('ielts-tests')
export class IeltsTestsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  create(@Body() createIeltsTestDto: CreateIeltsTestDto) {
    return this.ieltsTestsService.create(createIeltsTestDto);
  }

  @Get()
  findAll() {
    return this.ieltsTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ieltsTestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIeltsTestDto: UpdateIeltsTestDto) {
    return this.ieltsTestsService.update(+id, updateIeltsTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ieltsTestsService.remove(+id);
  }
}
