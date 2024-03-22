import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { CustomException } from 'src/common/exceptions/custom.exception';
import getUser from 'src/common/functions/getUser.function';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { MailService } from 'src/modules/app/mail/mail.service';
import { PostgresDataSource } from '../../../common/configs/typeorm.config';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { JwtPayloadType } from '../../../common/types/jwtPayload.type';
import { JwtPayloadWithTimeType } from '../../../common/types/jwtPayloadWithTime.type';
import { TokensType } from '../../../common/types/tokens.type';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserLanguageDto } from './dto/createUserLanguage.dto';
import { DeleteUserLanguageDto } from './dto/deleteUserLanguage.dto';
import { RecoverUserPasswordDto } from './dto/recoverUserPassword.dto';
import { SendCodeDto } from './dto/sendCode.dto';
import { SignInDto } from './dto/signIn.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserLanguageDto } from './dto/updateUserLanguage.dto';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto';
import { UserCodeDto } from './dto/userCode.dto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { MinioService } from '../s3/minio.service';
import { UserCodeDocument, UserCodeTypeEnum } from '../database/entities/userCode.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserEntity } from '../database/entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(entityNameConstant.USER) private readonly userModel: Model<UserDocument>,
    @InjectModel(entityNameConstant.USER_CODE) private readonly userCodeModel: Model<UserCodeDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
  ) {}

  public async signIn(dto: SignInDto): Promise<CustomResponseType> {
    const userEntity = await this.userModel
      .findOne(
        {
          email: dto.email,
        },
        {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isVerified: true,
          languages: true,
          password: true,
        },
      )
      .exec();
    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.DATA_NOT_FOUND,
      });
    }

    const passwordMatches = await argon.verify(userEntity.password, dto.password);
    if (!passwordMatches) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }
    if (userEntity.isVerified == false) {
      throw new CustomException({
        statusCode: HttpStatus.ACCEPTED,
        errorTypeCode: CustomErrorTypeEnum.ACCOUNT_NOT_VERIFIED,
      });
    }

    delete userEntity.password;
    return {
      statusCode: HttpStatus.OK,
      data: {
        tokens: await this.generateTokens({ id: userEntity.id, email: userEntity.email, firstName: userEntity.firstName, lastName: userEntity.lastName }),
        user: userEntity,
      },
    };
  }

  public async createUser(dto: CreateUserDto): Promise<CustomResponseType> {
    const userEntity = await this.userModel.findOne({ email: dto.email }, { _id: true }).exec();
    if (userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        errorTypeCode: CustomErrorTypeEnum.ENTRY_ALREADY_EXISTS,
      });
    }

    const newUser = await this.userModel.create(dto);
    await this.createUserCode(newUser, UserCodeTypeEnum.VERIFICATION);

    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  public async verifyUser(dto: UserCodeDto): Promise<CustomResponseType> {
    const confirmationCode = await this.userCodeModel.findOne({ value: dto.code, type: UserCodeTypeEnum.VERIFICATION }, { id: true }).exec();
    if (!confirmationCode) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.INVALID_USER_CODE,
      });
    }
    const userEntity = await this.userModel.findOne({ id: confirmationCode.users }, { id: true, email: true, firstName: true, lastName: true });
    await this.userModel.updateOne(
      {
        id: userEntity.id,
      },
      {
        isVerified: true,
      },
    );
    await this.userCodeModel.deleteOne({ id: confirmationCode.id });
    return {
      statusCode: HttpStatus.OK,
      data: {
        tokens: await this.generateTokens(userEntity as JwtPayloadType),
        user: userEntity,
      },
    };
  }

  public async checkRecoveryCode(dto: UserCodeDto): Promise<CustomResponseType> {
    const recoverCode = await this.userCodeModel.findOne({ value: dto.code, type: UserCodeTypeEnum.RECOVER }, { id: true });
    if (!recoverCode) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        errorTypeCode: CustomErrorTypeEnum.INVALID_USER_CODE,
      });
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async recoverUserPassword(dto: RecoverUserPasswordDto): Promise<CustomResponseType> {
    const user = new UserEntity();
    const recoverCode = await this.userCodeModel.findOne({ value: dto.code, type: UserCodeTypeEnum.RECOVER }).exec();
    if (!recoverCode) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INVALID_USER_CODE,
      });
    }
    user.password = await argon.hash(dto.password, {
      type: 2,
      salt: Buffer.from(process.env.SALT, 'utf-8'),
    });
    await this.userModel.findOneAndUpdate(recoverCode.users, user);
    await this.userCodeModel.findOneAndDelete({ _id: recoverCode.id });
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async sendUserCode(dto: SendCodeDto): Promise<CustomResponseType> {
    const userEntity = await this.userModel.findOne({ email: dto.email });
    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.NOT_FOUND, property: 'email' }],
      });
    }
    if (dto.codeType == UserCodeTypeEnum.VERIFICATION && !!userEntity.isVerified) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        errorTypeCode: CustomErrorTypeEnum.USER_ALREADY_VERIFIED,
      });
    }

    await this.createUserCode(userEntity, dto.codeType);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async readUserData(userId: string): Promise<CustomResponseType> {
    const userEntity = await this.userModel
      .findOne(
        { _id: userId },
        {
          _id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          email: true,
          phone: true,
          birthday: true,
          laboratory: true,
          specialization: true,
          sex: true,
          avatarUrl: true,
          languages: true,
        },
      )
      .exec();
    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }
    return {
      statusCode: HttpStatus.OK,
      data: {
        user: userEntity,
      },
    };
  }

  public async update(dto: UpdateUserDto, userId: string): Promise<CustomResponseType> {
    const mongoTransactionSession = await this.connection.startSession();

    try {
      await mongoTransactionSession.startTransaction();

      if (dto?.phone) {
        const parsedPhone = parsePhoneNumber(dto.phone, dto.phoneCountryCode);
        dto.phone = parsedPhone.nationalNumber;

        const phone = await this.userModel
          .count({ id: { $ne: userId }, phone: dto.phone })
          .session(mongoTransactionSession)
          .exec();
        if (phone) {
          throw ValidationErrorTypeEnum.IS_UNIQUE;
        }
      }

      await this.userModel.updateOne({ _id: userId }, dto).session(mongoTransactionSession).exec();

      await mongoTransactionSession.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await mongoTransactionSession.abortTransaction();

      if (e === ValidationErrorTypeEnum.IS_UNIQUE) {
        throw new CustomException({
          statusCode: HttpStatus.CONFLICT,
          validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE, property: 'phone' }],
        });
      }
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await mongoTransactionSession.endSession();
    }
  }

  public async uploadAvatar(userId: string, file: Express.Multer.File) {
    const userEntity = await getUser(userId);

    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }

    const checkFileType = this.minioService.getFileType(file.originalname);
    if (!checkFileType) {
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const uniqueObjectName = await this.minioService.generateObjectName(file.originalname);

    try {
      const uploadedFile = await this.minioService.uploadFile(file, uniqueObjectName);
      if (userEntity.avatarUrl) {
        await this.minioService.removeObjectFromMinio(userEntity.avatarUrl.split('/').pop());
      }
      await this.userModel.updateOne({ id: userId }, { avatarUrl: uploadedFile });
    } catch (e) {
      console.error(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async removeAvatar(userId: string) {
    const userEntity = await getUser(userId);

    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }

    //TODO: throw exception if avatarURL==null

    try {
      const objectName = userEntity.avatarUrl.split('/').pop();
      await this.minioService.removeObjectFromMinio(objectName);
      await this.userModel.updateOne({ id: userId }, { avatarUrl: null });
    } catch (e) {
      console.error(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async createUserLanguage(dto: CreateUserLanguageDto, userId: string): Promise<CustomResponseType> {
    const mongoTransactionSession = await this.connection.startSession();
    try {
      await mongoTransactionSession.startTransaction();

      for (const userLanguage of dto.userLanguages) {
        const uniqueCheck = await this.userModel.find({ _id: userId, languages: userLanguage }).session(mongoTransactionSession);
        if (uniqueCheck.length > 0) {
          throw ValidationErrorTypeEnum.IS_UNIQUE;
        }
        await this.userModel
          .findOneAndUpdate({ _id: userId }, { languages: { proficiency: userLanguage.proficiency, language: userLanguage.language } })
          .session(mongoTransactionSession)
          .exec();
      }
      await mongoTransactionSession.commitTransaction();
    } catch (e) {
      await mongoTransactionSession.abortTransaction();
      if (e === ValidationErrorTypeEnum.IS_UNIQUE) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE, property: 'userLanguage' }],
        });
      } else {
        throw new CustomException({
          statusCode: HttpStatus.NOT_FOUND,
          validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.NOT_FOUND, property: 'language' }],
        });
      }
    } finally {
      await mongoTransactionSession.endSession();
    }

    const updatedUserLanguagesEntity = await this.userModel
      .findOne({ _id: userId }, { _id: true, languages: { language: { code: true, title: true, native: true, region: true } } })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      data: { user: { userLanguages: updatedUserLanguagesEntity } },
    };
  }

  public async deleteUserLanguage(dto: DeleteUserLanguageDto, userId: string): Promise<CustomResponseType> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    const mongoTransactionSession = await this.connection.startSession();
    try {
      await mongoTransactionSession.startTransaction();

      for (const userLanguage of dto.userLanguages) {
        const accessCheck = await this.userModel.find({ _id: userId, languages: userLanguage }).session(mongoTransactionSession).exec();
        console.log(accessCheck);
        if (accessCheck.length == 0) {
          throw CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND;
        }
        await queryRunner.manager.query('DELETE FROM "UserLanguage" WHERE id = $1', [userLanguage]);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e === CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND) {
        throw new CustomException({
          statusCode: HttpStatus.FORBIDDEN,
          errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
        });
      } else {
        console.log(e);
        throw new CustomException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    } finally {
      await queryRunner.release();
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateUserLanguage(dto: UpdateUserLanguageDto, userId: string): Promise<CustomResponseType> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const userLanguage of dto.userLanguages) {
        const tmpUpdatedEntity = await queryRunner.manager.query('UPDATE "UserLanguage" SET proficiency = $1 WHERE id = $2 AND "userId" = $3', [
          userLanguage.proficiency,
          userLanguage.userLanguageId,
          userId,
        ]);
        if (tmpUpdatedEntity[1] === 0) {
          throw CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND;
        }
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e === CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND) {
        throw new CustomException({
          statusCode: HttpStatus.FORBIDDEN,
          errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
        });
      } else {
        console.log(e);
        throw new CustomException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    } finally {
      await queryRunner.release();
    }

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateUserPassword(dto: UpdateUserPasswordDto, id: string): Promise<CustomResponseType> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }

    user.password = await argon.hash(dto.newPassword, {
      type: 2,
      salt: Buffer.from(process.env.SALT, 'utf-8'),
    });
    await this.userModel.findOneAndUpdate({ _id: id }, user);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async generateTokens(userJwtPayload: JwtPayloadType): Promise<TokensType> {
    const jwtPayload = this.getPayload(userJwtPayload);

    return {
      accessToken: await this.jwtService.signAsync(jwtPayload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: '2d',
      }),
      refreshToken: await this.jwtService.signAsync(jwtPayload, {
        privateKey: process.env.JWT_SECRET_2,
        expiresIn: '30d',
      }),
    };
  }

  public async refreshTokens(userJwtPayload: JwtPayloadWithTimeType): Promise<CustomResponseType> {
    return {
      statusCode: HttpStatus.OK,
      data: {
        tokens: await this.generateTokens(userJwtPayload),
      },
    };
  }

  private async createUserCode(userEntity: UserDocument, codeType: UserCodeTypeEnum): Promise<void> {
    const user = await this.userModel.findOne({ email: userEntity.email });

    const codeEntity = await this.userCodeModel.findOne({ user: user._id, type: codeType }).exec();

    console.log(codeEntity);

    if (!!codeEntity) {
      const timeDifference = Math.abs(codeEntity['createdAt'].getTime() - new Date().getTime());
      if (timeDifference <= 300000) {
        throw new CustomException({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          data: { timeLeft: Math.abs(timeDifference - 300000) },
          errorTypeCode: CustomErrorTypeEnum.TOO_MANY_REQUESTS,
        });
      } else {
        await this.userCodeModel.deleteOne({ id: codeEntity.id });
      }
    }
    await this.sendAndSaveUserCode(codeType, userEntity);
    return;
  }

  /* Create or update new code */
  private async sendAndSaveUserCode(codeType: UserCodeTypeEnum, codeEntity: UserDocument): Promise<void> {
    const code = await this.generateCode();
    if (codeType == UserCodeTypeEnum.RECOVER) {
      await this.mailService.sendRecoverCode(codeEntity.email, codeEntity.firstName, code);
      await this.userCodeModel.create({
        value: code,
        type: codeType,
        user: { _id: codeEntity.id },
      });
    } else if (codeType == UserCodeTypeEnum.VERIFICATION) {
      await this.mailService.sendConfirmationCode(codeEntity.email, codeEntity.firstName, code);
      await this.userCodeModel.create({
        value: code,
        type: codeType,
        user: { _id: codeEntity.id },
      });
    }
    return;
  }

  private async generateCode(): Promise<string> {
    let code = '';
    let isExists = undefined;
    const characters = '0123456789';
    const charactersLength = characters.length;
    do {
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      isExists = await this.userCodeModel.findOne({ value: code }, { id: true });
    } while (isExists);
    return code;
  }

  private getPayload(user: JwtPayloadType): JwtPayloadType {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
