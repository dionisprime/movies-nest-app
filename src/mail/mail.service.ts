import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { FROM_EMAIL, SETTINGS } from './mail.constants';

interface ISendMessage {
  email: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private client;

  constructor() {
    this.client = nodemailer.createTransport(SETTINGS);
  }

  async sendMessage({ email, subject, html }: ISendMessage) {
    await this.client.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });
  }

  async sendNewReleaseNotification(
    email: string,
    movieDetails: any,
  ): Promise<void> {
    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: `Вышел новый фильм: ${movieDetails.title}`,
      text: `Обязательно посмотрите: ${movieDetails.title}, ${movieDetails.description}`,
    };

    await this.client.sendMail(mailOptions);
  }
}
