import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/modules/app/mail/mail.module';
import { LanguageEntity } from '../database/entities/postgres/language.entity';
import { UserEntity } from '../database/entities/postgres/user.entity';
import { UserCodeEntity } from '../database/entities/postgres/userCode.entity';
import { UserLanguageEntity } from '../database/entities/postgres/userLanguage.entity';
import { JwtStrategy } from './passport/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MinioModule } from '../s3/minio.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, UserCodeEntity, UserLanguageEntity, LanguageEntity]),
    MailModule,
    MinioModule,
  ],
})
export class UserModule {}
