import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          pool: true,
          service: 'Gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
          },
        },
        defaults: {
          from: '"experiment-constructor-and-stat" <experiment-constructor-and-stat@gmail.com>',
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
