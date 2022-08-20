import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.mail.env' }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.MAIL_TRANSPORT,
        defaults: {
          from: `"nest-modules" <${process.env.MAIL_FROM_EMAIL}>`,
        },
        template: {
          dir: __dirname + '/../mail/assets/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
