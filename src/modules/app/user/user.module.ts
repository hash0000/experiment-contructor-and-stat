import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/modules/app/mail/mail.module';
import { LanguageEntityP } from '../database/entities/postgres/language.entity';
import { UserEntityP } from '../database/entities/postgres/user.entity';
import { UserCodeEntityP } from '../database/entities/postgres/userCode.entity';
import { UserLanguageEntityP } from '../database/entities/postgres/userLanguage.entity';
import { JwtStrategy } from './passport/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MinioModule } from '../s3/minio.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../database/entities/user.entity';
import { UserCodeSchema } from '../database/entities/userCode.entity';
import { LanguageSchema } from '../database/entities/language.entity';
import { VariableSchema } from '../database/entities/variable.schema';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

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
    MongooseModule.forFeature([
      { name: entityNameConstant.USER, schema: UserSchema },
      { name: entityNameConstant.USER_CODE, schema: UserCodeSchema },
      { name: entityNameConstant.LANGUAGE, schema: LanguageSchema },
      { name: entityNameConstant.VARIABLE, schema: VariableSchema },
    ]),
    TypeOrmModule.forFeature([UserEntityP, UserCodeEntityP, UserLanguageEntityP, LanguageEntityP]),
    MailModule,
    MinioModule,
  ],
})
export class UserModule {}
