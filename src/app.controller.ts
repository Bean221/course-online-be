import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Định nghĩa controller cho route gốc
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Đánh dấu phương thức này sẽ xử lý HTTP GET tại đường dẫn "/"
  getHello(): string {
    return this.appService.getHello();
  }
}
