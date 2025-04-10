import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { IeltsTestsService } from './ielts_tests.service';
import { GetTestDto } from './dto/get-test.dto';
import { SubmitTestDto } from './dto/submit-test.dto';

export enum Skill {
  Reading = 'reading',
  Listening = 'listening',
  Writing = 'writing',
  Speaking = 'speaking',
}

@Controller('ielts-tests')
export class IeltsTestsController {
  constructor(private readonly service: IeltsTestsService) {}

  // API tạo đề thi (dành cho ADMIN)
  @Post('create-test')
  async createTest(
    @Body()
    body: {
      name: string;
      description?: string;
      reading?: boolean;
      listening?: boolean;
      writing?: boolean;
      speaking?: boolean;
    },
  ) {
    return await this.service.createTest(body);
  }

  // API tạo câu hỏi cho đề thi (dành cho ADMIN)
  @Post('create-question')
  async createQuestion(
    @Body()
    body: {
      mock_test_id: number;
      skill: string;
      task_number?: number;
      question_text: string;
      options?: string;
      correct_answer?: string;
    },
  ) {
    return await this.service.createQuestion(body);
  }

  // API lấy đề thi (cho user; có thể lọc theo testId hoặc skill)
  @Get()
  async getTests(@Query() query: GetTestDto) {
    return await this.service.getTests(query);
  }

  // API nộp bài và chấm điểm (cho user)
  @Post('submit')
  async submitTest(@Body() submitTestDto: SubmitTestDto) {
    return await this.service.submitTest(submitTestDto);
  }
}
