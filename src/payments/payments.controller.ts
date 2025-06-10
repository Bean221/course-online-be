// import {
//   Body,
//   Controller,
//   Get,
//   Headers,
//   Param,
//   Post,
//   Req,
//   UseGuards,
//   HttpStatus, // Import HttpStatus
//   HttpException, // Import HttpException
//   BadRequestException, // Import BadRequestException
// } from '@nestjs/common';
// import { PaymentService, WebhookType } from '../payments/payments.service'; // Import PaymentService và WebhookType
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Điều chỉnh đường dẫn đến JwtAuthGuard của bạn
// import { Request } from 'express'; // Đảm bảo Request được import từ 'express'

// // Mở rộng interface Request từ Express để bao gồm thuộc tính rawBody
// // Thuộc tính này được thêm vào bởi RawBodyMiddleware
// interface RequestWithRawBody extends Request {
//   rawBody: string;
// }

// @Controller('payments') // Base path cho các route trong controller này
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   // Route để khởi tạo quy trình thanh toán và tạo link PayOS
//   @Post('initiate')
//   @UseGuards(JwtAuthGuard) // Bảo vệ route, yêu cầu xác thực JWT
//   async createPayment(
//     @Body() body: { registrationId: number }, // Nhận registrationId từ request body
//     @Req() req: Request & { user?: { sub: number } }, // Lấy thông tin user từ request (đã được thêm bởi JwtAuthGuard)
//   ) {
//     // Kiểm tra xem user có được xác thực và có ID không
//     if (!req.user?.sub) {
//       // Ném HttpException chuẩn thay vì Error
//       throw new HttpException(
//         'Người dùng chưa xác thực hoặc thông tin không hợp lệ',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     if (!body.registrationId) {
//       throw new BadRequestException(
//         'Thiếu thông tin registrationId trong request body.',
//       );
//     }
//     // Gọi service để khởi tạo thanh toán
//     return this.paymentService.initializePayment(
//       req.user.sub, // userId
//       body.registrationId, // registrationId
//     );
//   }

//   // Route nhận webhook từ PayOS
//   @Post('webhook')
//   // @Header('Content-Type', 'application/json') // Header này thường do client gửi, không cần set ở đây cho endpoint nhận
//   // Endpoint này KHÔNG cần UseGuards vì PayOS server gọi đến, không có JWT
//   async handleWebhook(
//     @Body() data: WebhookType, // NestJS sẽ parse JSON body vào object có kiểu WebhookType
//     @Headers('x-payos-signature') signature: string, // Lấy header chữ ký từ PayOS
//     @Req() req: RequestWithRawBody, // Lấy request object bao gồm rawBody từ middleware
//   ) {
//     // Kiểm tra xem rawBody có tồn tại không (đảm bảo middleware hoạt động)
//     if (!req.rawBody) {
//       console.error('[PAYOS WEBHOOK ERROR] Raw body not available on request.');
//       // Ném lỗi 500 nếu không lấy được raw body - dấu hiệu lỗi cấu hình server
//       throw new HttpException(
//         'Internal server error: Raw body not available for webhook verification.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//     // Kiểm tra xem header chữ ký có tồn tại không
//     if (!signature) {
//       console.warn('[PAYOS WEBHOOK ERROR] Missing x-payos-signature header.');
//       // Ném lỗi 400 nếu thiếu header quan trọng
//       throw new BadRequestException('Thiếu header x-payos-signature.');
//     }

//     // Gọi service để xử lý webhook. Truyền cả data đã parse, signature và rawBody.
//     // Service sẽ xác minh signature bằng rawBody.
//     return this.paymentService.handleWebhook(data, signature, req.rawBody);
//   }

//   // Route để client lấy trạng thái thanh toán của một đăng ký cụ thể
//   @Get('status/:registrationId')
//   @UseGuards(JwtAuthGuard) // Bảo vệ route
//   async getPaymentStatus(
//     @Param('registrationId') registrationId: string, // Lấy registrationId từ URL params
//     @Req() req: Request & { user?: { sub: number } }, // Lấy thông tin user
//   ) {
//     if (!req.user?.sub) {
//       throw new HttpException(
//         'Người dùng chưa xác thực hoặc thông tin không hợp lệ',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     // Chuyển registrationId từ string sang number
//     const regId = parseInt(registrationId, 10); // Luôn thêm radix 10
//     // Kiểm tra xem kết quả parse có hợp lệ không
//     if (isNaN(regId)) {
//       throw new BadRequestException('ID đăng ký không hợp lệ.');
//     }
//     // Gọi service để lấy trạng thái thanh toán
//     return this.paymentService.getPaymentStatus(
//       req.user.sub, // userId
//       regId, // registrationId (number)
//     );
//   }
// }
