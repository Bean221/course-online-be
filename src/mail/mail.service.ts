import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: cfg.get('GMAIL_USER'),
        pass: cfg.get('GMAIL_PASS'),
      },
    });
  }

  async send(opts: { to: string; subject: string; html: string }) {
    await this.transporter.sendMail({
      from: this.cfg.get('GMAIL_USER'),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  }
}
