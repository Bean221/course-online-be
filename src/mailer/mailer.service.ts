import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Payment, Registration } from '@prisma/client';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get('GMAIL_USER'),
        pass: config.get('GMAIL_PASS'),
      },
    });
  }

  async sendPaymentConfirmation(
    email: string,
    payment: Payment & { registration: Registration },
  ) {
    const mailOptions = {
      from: `IELTS Center <${this.config.get('GMAIL_USER')}>`,
      to: email,
      subject: `[IELTS] Payment Confirmation - ${payment.payosOrderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">Payment Successful!</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1e40af;">Exam Details</h3>
            <p><strong>Exam Type:</strong> ${payment.registration.examType}</p>
            <p><strong>Date:</strong> ${new Date(payment.registration.selectedDate).toLocaleDateString('vi-VN')}</p>
            <p><strong>Location:</strong> ${payment.registration.location}</p>
            <p><strong>Format:</strong> ${payment.registration.format}</p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1e40af;">Payment Information</h3>
            <p><strong>Transaction ID:</strong> ${payment.payosOrderId}</p>
            <p><strong>Amount:</strong> ${payment.amount.toLocaleString()} VND</p>
            <p><strong>Status:</strong> ${payment.status}</p>
            ${payment.qrUrl ? `<img src="${payment.qrUrl}" style="max-width: 200px;" alt="Payment QR Code">` : ''}
          </div>

          <p style="margin-top: 20px; color: #4b5563;">
            Please keep this email for your records. Contact us if you have any questions.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
