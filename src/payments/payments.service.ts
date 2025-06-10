// import {
//   BadRequestException,
//   ForbiddenException,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';
// import PayOS from '@payos/node';
// import { ConfigService } from '@nestjs/config';
// import { PrismaService } from '../prisma/prisma.service'; // Điều chỉnh đường dẫn đến PrismaService của bạn
// import { MailerService } from '../mailer/mailer.service'; // Điều chỉnh đường dẫn đến MailerService của bạn
// import { payment_status_enum, payment_method_enum, Registration } from '@prisma/client'; // Import enum từ Prisma client

// // Interface định nghĩa cấu trúc dữ liệu webhook từ PayOS
// export interface WebhookType {
//   success: boolean;
//   code: string;
//   desc: string;
//   data: {
//     paymentLinkId: string;
//     code: string;
//     desc: string;
//     orderCode: number;
//     amount: number;
//     status: 'PAID' | 'CANCELLED' | 'FAILED';
//     description: string;
//     accountNumber: string;
//     reference: string;
//     currency: string;
//     transactionDateTime: string;
//     qrCode?: string;
//     virtualAccount?: string;
//   };
//   signature: string;
// }

// // Interface for email confirmation data
// export interface PaymentConfirmationData {
//   fullName: string;
//   examType: string;
//   amount: any;
//   payosAmount: number;
//   orderCode: string;
//   paymentDate: Date | null;
// }

// @Injectable()
// export class PaymentService {
//   private payos: PayOS | undefined;

//   constructor(
//     private config: ConfigService,
//     private prisma: PrismaService,
//     private mailer: MailerService, // Inject MailerService
//   ) {
//     // Đảm bảo các biến môi trường PayOS được cung cấp khi ứng dụng khởi động
//     const clientId = config.get<string>('PAYOS_CLIENT_ID');
//     const apiKey = config.get<string>('PAYOS_API_KEY');
//     const checksumKey = config.get<string>('PAYOS_CHECKSUM_KEY'); // Khóa xác minh Webhook

//     if (!clientId || !apiKey || !checksumKey) {
//       // Log hoặc ném lỗi rõ ràng nếu cấu hình thiếu
//       console.error(
//         'Missing PayOS configuration. Please check environment variables PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY.',
//       );
//       // Tùy chọn: ném lỗi để ngăn ứng dụng khởi động với cấu hình sai
//       // throw new Error('PayOS configuration is incomplete.');
//     }

//     // Khởi tạo PayOS client chỉ khi có đủ cấu hình, tránh lỗi
//     if (clientId && apiKey && checksumKey) {
//       this.payos = new PayOS(clientId, apiKey, checksumKey);
//     } else {
//       // Gán một đối tượng rỗng hoặc xử lý khác nếu không khởi tạo được PayOS
//       // Điều này tùy thuộc vào logic ứng dụng của bạn khi thiếu cấu hình PayOS
//       this.payos = undefined; // PayOS client chưa được khởi tạo
//     }
//   }

//   // Hàm kiểm tra xem PayOS client đã được khởi tạo thành công chưa
//   private ensurePayOSInitialized() {
//     if (!this.payos) {
//       throw new HttpException(
//         'PayOS service not configured. Please check server setup.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async initializePayment(userId: number, registrationId: number) {
//     this.ensurePayOSInitialized(); // Kiểm tra PayOS client trước khi dùng

//     const registration = await this.prisma.registration.findUnique({
//       where: { id: registrationId, userId },
//       include: { user: true }, // Include user để lấy thông tin người dùng nếu cần
//     });

//     if (!registration) {
//       throw new BadRequestException(
//         'Không tìm thấy thông tin đăng ký hoặc bạn không có quyền truy cập.',
//       );
//     }

//     // Chỉ cho phép tạo link thanh toán nếu trạng thái đăng ký là 'pending'
//     if (registration.status !== 'pending') {
//       // Ném lỗi rõ ràng nếu trạng thái không cho phép thanh toán
//       throw new BadRequestException(
//         `Đăng ký đang ở trạng thái "${registration.status}", không thể tạo link thanh toán.`,
//       );
//     }

//     // Sử dụng timestamp làm orderCode, đảm bảo là số nguyên duy nhất tại thời điểm tạo
//     // PayOS yêu cầu orderCode là số nguyên, không trùng lặp trong hệ thống của bạn
//     const orderCode = Date.now();
//     // Chuyển đổi giá từ đơn vị tiền tệ của bạn sang đơn vị PayOS mong muốn (integer VNĐ)
//     // Giả sử registration.price là VNĐ và cần làm tròn thành số nguyên
//     const amount = Math.round(Number(registration.price));

//     // Kiểm tra số tiền hợp lệ
//     if (isNaN(amount) || amount <= 0) {
//       throw new BadRequestException('Số tiền thanh toán không hợp lệ.');
//     }

//     // Lấy URL callback từ cấu hình
//     const returnUrl = this.config.get<string>('CLIENT_URL')
//       ? `${this.config.get('CLIENT_URL')}/payment/result`
//       : undefined;
//     const cancelUrl = this.config.get<string>('CLIENT_URL')
//       ? `${this.config.get('CLIENT_URL')}/payment/cancel`
//       : undefined;

//     if (!returnUrl || !cancelUrl) {
//       throw new HttpException(
//         'Payment callback URLs are not configured. Please check CLIENT_URL configuration.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     try {
//       this.ensurePayOSInitialized();
//       const paymentLink = await this.payos!.createPaymentLink({
//         amount: amount, // Sử dụng amount đã tính toán (integer VNĐ)
//         description: `Thanh toan le phi thi IELTS ${registration.examType} cho ${registration.fullName}`,
//         orderCode: orderCode, // Truyền orderCode là number
//         returnUrl: returnUrl, // URL khi thanh toán thành công
//         cancelUrl: cancelUrl, // URL khi hủy thanh toán
//         items: [
//           // Danh sách các mặt hàng (tùy chọn nhưng nên có)
//           {
//             name: `Le phi thi ${registration.examType}`,
//             quantity: 1,
//             price: amount, // Giá mặt hàng (integer VNĐ)
//           },
//         ],
//         // Thông tin người mua (tùy chọn nhưng nên có)
//         buyerName: registration.fullName,
//         buyerEmail: registration.email,
//         buyerPhone: registration.phone,
//         // Có thể thêm buyerAddress, signature, expireDate... theo tài liệu PayOS
//       });

//       // Tạo bản ghi Payment trong cơ sở dữ liệu
//       // Lưu orderCode từ PayOS dưới dạng string để tìm kiếm dễ dàng hơn
//       await this.prisma.payment.create({
//         data: {
//           registrationId,
//           userId, // Lưu userId để dễ dàng truy vấn theo người dùng
//           payosOrderId: orderCode.toString(), // Lưu dưới dạng string
//           amount: registration.price, // Lưu giá trị ban đầu từ registration (có thể là Decimal/Float trong DB)
//           status: payment_status_enum.pending, // Trạng thái ban đầu là pending
//           paymentMethod: payment_method_enum.PayOS, // Phương thức thanh toán
//           // Các trường khác (transactionId, paymentDate, etc.) sẽ được cập nhật từ webhook
//         },
//       });
//       // Không cần update registration status ở đây, trạng thái 'pending' đã được kiểm tra,
//       // và trạng thái cuối cùng ('paid', 'failed') sẽ được cập nhật bởi webhook.

//       // Trả về URL thanh toán cho client
//       return { checkoutUrl: paymentLink.checkoutUrl };
//     } catch (error) {
//       console.error('Lỗi khi tạo link thanh toán PayOS:', error);
//       // Ném lỗi HttpException để trả về response chuẩn cho client
//       throw new HttpException(
//         'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // Thêm tham số rawBody string nhận từ middleware
//   async handleWebhook(data: WebhookType, signature: string, rawBody: string) {
//     this.ensurePayOSInitialized(); // Kiểm tra PayOS client trước khi dùng

//     try {
//       // --- Bước 1: Xác minh chữ ký webhook ---
//       // Sử dụng rawBody và signature để xác minh
//       const isValid = this.payos!.verifyPaymentWebhookData(data);

//       if (!isValid) {
//         console.warn('[PAYOS WEBHOOK] Invalid signature received.', {
//           signature,
//           rawBody,
//         });
//         // Theo tài liệu PayOS, trả về non-2xx khi chữ ký không hợp lệ
//         throw new ForbiddenException('Chữ ký webhook không hợp lệ');
//       }

//       console.log('[PAYOS WEBHOOK] Webhook received (signature valid):', data);

//       // --- Bước 2: Kiểm tra dữ liệu webhook cần thiết ---
//       if (!data?.data?.orderCode) {
//         console.error('[PAYOS WEBHOOK] Missing orderCode in payload:', data);
//         // Trả về non-2xx khi thiếu dữ liệu quan trọng
//         throw new BadRequestException(
//           'Thiếu thông tin orderCode trong webhook payload',
//         );
//       }

//       // --- Bước 3: Xử lý sự kiện trong Transaction ---
//       // Sử dụng transaction để đảm bảo tính nhất quán khi cập nhật nhiều bảng (Payment, Registration)
//       return await this.prisma.$transaction(async (tx) => {
//         // Tìm bản ghi payment dựa vào payosOrderId (đã lưu dưới dạng string)
//         // Sử dụng findUnique để đảm bảo chỉ có 1 kết quả
//         const payment = await tx.payment.findUnique({
//           where: { payosOrderId: data.data.orderCode.toString() }, // Chuyển orderCode từ webhook (number) sang string
//           include: { registration: true, user: true }, // Include relations để dùng cho email hoặc kiểm tra quyền
//         });

//         if (!payment) {
//           console.error(
//             `[PAYOS WEBHOOK] Payment record not found for orderCode: ${data.data.orderCode}`,
//           );
//           // Trả về lỗi non-2xx để PayOS biết chúng ta không tìm thấy bản ghi tương ứng
//           throw new BadRequestException(
//             `Không tìm thấy bản ghi thanh toán cho orderCode: ${data.data.orderCode}`,
//           );
//         }

//         // --- Bước 4: Xử lý Idempotency (Tránh xử lý trùng lặp) ---
//         // Kiểm tra nếu payment đã xử lý rồi (trạng thái khác 'pending')
//         if (payment.status !== payment_status_enum.pending) {
//           console.warn(
//             `[PAYOS WEBHOOK] Payment for orderCode ${data.data.orderCode} already processed (status: ${payment.status}). Skipping reprocessing.`,
//           );
//           // Trả về response thành công (200 OK với code '00') để PayOS dừng retry
//           return {
//             code: '00',
//             message: 'Webhook đã được xử lý trước đó.',
//             orderCode: data.data.orderCode, // Trả lại orderCode từ webhook
//           };
//         }

//         // --- Bước 5: Cập nhật trạng thái Payment ---
//         const newPaymentStatus =
//           data.data.status === 'PAID'
//             ? payment_status_enum.success
//             : payment_status_enum.failed; // PayOS gửi CANCELLED hoặc FAILED

//         const updatedPayment = await tx.payment.update({
//           where: { id: payment.id },
//           data: {
//             status: newPaymentStatus,
//             paymentDate: data.data.transactionDateTime
//               ? new Date(data.data.transactionDateTime)
//               : new Date(),
//           },
//           include: {
//             registration: true
//           }
//         });

//         // --- Bước 6: Cập nhật trạng thái Registration và Gửi Email (Chỉ khi thanh toán thành công) ---
//         if (data.data.status === 'PAID') {
//           if (!updatedPayment.registration) {
//             console.error(
//               `[PAYOS WEBHOOK] Registration record not found for payment ID: ${updatedPayment.id} after update.`,
//             );
//             throw new HttpException(
//               'Không tìm thấy thông tin đăng ký liên quan để cập nhật.',
//               HttpStatus.INTERNAL_SERVER_ERROR,
//             );
//           }

//           const registration = updatedPayment.registration as Registration;

//           // Cập nhật trạng thái đăng ký sang 'paid'
//           await tx.registration.update({
//             where: { id: updatedPayment.registrationId },
//             data: { status: 'paid' },
//           });

//           // Gửi email xác nhận thanh toán
//           try {
//             await this.mailer.sendPaymentConfirmation(
//               registration.email,
//               {
//                 fullName: registration.fullName,
//                 examType: registration.examType,
//                 amount: updatedPayment.amount,
//                 payosAmount: data.data.amount,
//                 orderCode: updatedPayment.payosOrderId,
//                 paymentDate: updatedPayment.paymentDate,
//               },
//             );
//             console.log(
//               `[PAYOS WEBHOOK] Payment confirmation email sent to ${updatedPayment.registration.email} for orderCode: ${data.data.orderCode}`,
//             );
//           } catch (emailError) {
//             console.error(
//               `[PAYOS WEBHOOK] Failed to send payment confirmation email for orderCode ${data.data.orderCode}:`,
//               emailError,
//             );
//             // Tùy chọn: Bạn có thể chọn ném lỗi emailError để PayOS retry webhook
//             // Hoặc chỉ log lỗi và tiếp tục trả về thành công PayOS (email có thể gửi lại sau)
//             // Quyết định này phụ thuộc vào mức độ quan trọng của việc gửi email trong luồng của bạn.
//             // Nếu không ném lỗi, webhook sẽ được đánh dấu xử lý thành công trên PayOS dù email lỗi.
//           }

//           console.log(
//             `[PAYOS WEBHOOK] Payment successful, registration updated for orderCode: ${data.data.orderCode}`,
//           );
//         } else {
//           // Xử lý khi thanh toán thất bại hoặc bị hủy (data.status là CANCELLED hoặc FAILED)
//           console.warn(
//             `[PAYOS WEBHOOK] Payment failed or cancelled for orderCode: ${data.data.orderCode}. Status: ${data.data.status}. No registration update.`,
//           );
//           // Tùy chọn: Gửi email thông báo thất bại/hủy cho người dùng
//           // try { await this.mailer.sendPaymentFailure(updatedPayment.registration.email, { ... }); } catch (e) { ... }
//         }

//         // --- Bước 7: Trả về response thành công cho PayOS ---
//         // Theo tài liệu, response thành công cần có { code: '00', ... }
//         return {
//           code: '00',
//           message: 'Xử lý webhook thành công',
//           orderCode: data.data.orderCode, // Trả lại orderCode từ webhook
//         };
//       });
//     } catch (error) {
//       // --- Xử lý lỗi ---
//       console.error(
//         '[PAYOS WEBHOOK ERROR] Exception during webhook processing:',
//         {
//           error: error instanceof Error ? error.message : String(error),
//           payload: data, // Log payload nhận được để debug
//           stack: error instanceof Error ? error.stack : undefined, // Log stack trace nếu là Error object
//         },
//       );

//       // Theo tài liệu PayOS, khi xử lý webhook gặp lỗi (không phải trường hợp đã xử lý trùng lặp),
//       // cần trả về status code không phải 2xx để PayOS biết và retry.
//       // NestJS HttpException sẽ tự động làm điều này.
//       if (error instanceof HttpException) {
//         throw error; // Ném lại HttpException đã tạo ở các bước trên (Forbidden, BadRequest, InternalServerError)
//       } else {
//         // Ném lỗi HttpException mặc định cho bất kỳ lỗi nào khác không được xử lý cụ thể
//         throw new HttpException(
//           {
//             status: HttpStatus.INTERNAL_SERVER_ERROR,
//             error: 'Lỗi nội bộ khi xử lý webhook',
//             details: error instanceof Error ? error.message : 'Unknown error',
//           },
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }
//     }
//   }

//   // Hàm lấy trạng thái thanh toán cho người dùng và đăng ký cụ thể
//   async getPaymentStatus(userId: number, registrationId: number) {
//     // Tìm bản ghi payment liên quan đến đăng ký và người dùng
//     const payment = await this.prisma.payment.findFirst({
//       where: { registrationId, userId },
//       select: {
//         // Chọn các trường cần trả về cho client
//         status: true, // Trạng thái thanh toán
//         paymentDate: true, // Ngày/giờ thanh toán
//         payosOrderId: true, // Mã đơn hàng PayOS
//         qrUrl: true, // URL QR Code (nếu có và đã lưu)
//         amount: true, // Số tiền (từ DB, có thể là Decimal/Float)
//         // Thêm các trường khác nếu muốn hiển thị cho người dùng trên giao diện
//       },
//       orderBy: { createdAt: 'desc' }, // Lấy bản ghi payment mới nhất cho đăng ký này (phòng trường hợp tạo nhiều lần)
//     });

//     if (!payment) {
//       // Trả về null hoặc ném lỗi tùy thuộc vào cách API của bạn thiết kế
//       // Ném lỗi BadRequest nếu không tìm thấy thông tin thanh toán nào cho đăng ký/user này
//       throw new BadRequestException(
//         'Không tìm thấy thông tin thanh toán cho đăng ký này.',
//       );
//     }

//     return payment;
//   }
// }
