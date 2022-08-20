import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AdminEntity } from 'apps/account/src/app/admin/entities/admin.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  //отправляем письмо с кодом, который нужно будет ввести в форму восстановления пароля
  async forgotPassword(dto: AdminEntity) {
    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Сброс пароля',
        template: 'resetPassword',
        from: process.env.MAIL_FROM_EMAIL, // sender address
        context: {
          token: dto.passwordReset.token,
        },
      })
      .then(() => {
        console.log('успех');
      })
      .catch((e) => {
        console.log(e);
      });

    return '';
  }
}
