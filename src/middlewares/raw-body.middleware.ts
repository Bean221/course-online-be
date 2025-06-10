import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

// Mở rộng interface Request của Express để thêm thuộc tính rawBody
interface RequestWithRawBody extends Request {
  rawBody: string;
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: RequestWithRawBody, res: Response, next: NextFunction) {
    // Chỉ áp dụng middleware body-parser.json cho đường dẫn webhook
    // Điều này giúp đảm bảo các route khác không bị ảnh hưởng nếu không cần raw body
    if (req.originalUrl === '/payments/webhook') {
      json({
        verify: (req: RequestWithRawBody, res, buf) => {
          // Lưu trữ raw body vào request object trước khi parsing
          req.rawBody = buf.toString();
        },
      })(req, res, next);
    } else {
      // Đối với các route không phải webhook, chuyển tiếp ngay lập tức
      next();
    }
  }
}
