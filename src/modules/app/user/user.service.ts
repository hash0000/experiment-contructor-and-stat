import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { CustomException } from 'src/common/exceptions/custom.exception';
import getUser from 'src/common/functions/getUser.function';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { isEmptyObject } from 'src/common/validators/isEmptyObject.validator';
import { UserEntity } from 'src/modules/app/database/entities/postgres/user.entity';
import { CodeTypeEnum, UserCodeEntity } from 'src/modules/app/database/entities/postgres/userCode.entity';
import { MailService } from 'src/modules/app/mail/mail.service';
import { DataSource, Not, Repository } from 'typeorm';
import { PostgresDataSource } from '../../../common/configs/typeorm.config';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { JwtPayloadType } from '../../../common/types/jwtPayload.type';
import { JwtPayloadWithTimeType } from '../../../common/types/jwtPayloadWithTime.type';
import { TokensType } from '../../../common/types/tokens.type';
import { UserLanguageEntity } from '../database/entities/postgres/userLanguage.entity';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserCodeEntity)
    private readonly userCodesRepository: Repository<UserCodeEntity>,
    @InjectRepository(UserLanguageEntity)
    private readonly userLanguagesRepository: Repository<UserLanguageEntity>,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
  ) {}

  public async signIn(dto: SignInDto): Promise<CustomResponseType> {
    const userEntity = await this.usersRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isVerified: true,
        password: true,
      },
    });

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

    const userLanguagesEntity = await this.userLanguagesRepository.find({
      where: { user: { id: userEntity.id } },
      relations: {
        language: true,
      },
      select: {
        id: true,
        proficiency: true,
        language: {
          code: true,
          title: true,
          native: true,
        },
      },
    });

    const user = await getUser(userEntity.id);

    return {
      statusCode: HttpStatus.OK,
      data: {
        tokens: await this.generateTokens(userEntity),
        user: { ...user, userLanguages: userLanguagesEntity },
      },
    };
  }

  public async createUser(dto: CreateUserDto): Promise<CustomResponseType> {
    const user = await this.getUserByEmail(dto.email);
    if (!!user) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        errorTypeCode: CustomErrorTypeEnum.ENTRY_ALREADY_EXISTS,
      });
    }
    const newUser = await this.usersRepository.save(Object.assign(new UserEntity(), dto));
    await this.createUserCode(newUser, CodeTypeEnum.VERIFICATION);

    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  public async verifyUser(dto: UserCodeDto): Promise<CustomResponseType> {
    const confirmationCode = await this.userCodesRepository.findOne({
      where: {
        value: dto.code,
        type: CodeTypeEnum.VERIFICATION,
      },
      relations: {
        user: true,
      },
      select: {
        id: true,
        user: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    });

    if (!confirmationCode) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.INVALID_USER_CODE,
      });
    }
    await this.usersRepository.update(
      {
        id: confirmationCode.user.id,
      },
      {
        isVerified: true,
      },
    );
    await this.userCodesRepository.delete(confirmationCode.id);

    return {
      statusCode: HttpStatus.OK,
      data: {
        tokens: await this.generateTokens(confirmationCode.user),
        user: await getUser(confirmationCode.user.id),
      },
    };
  }

  public async checkRecoveryCode(dto: UserCodeDto): Promise<CustomResponseType> {
    const recoverCode = await this.userCodesRepository.findOne({
      where: {
        value: dto.code,
        type: CodeTypeEnum.RECOVER,
      },
      select: {
        id: true,
      },
    });
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
    const recoverCode = await this.userCodesRepository.findOne({
      where: {
        value: dto.code,
        type: CodeTypeEnum.RECOVER,
      },
      relations: {
        user: true,
      },
      select: {
        id: true,
        user: {
          id: true,
        },
      },
    });

    if (!recoverCode) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INVALID_USER_CODE,
      });
    }

    user.password = dto.password;
    await this.usersRepository.update(recoverCode.user.id, user);
    await this.userCodesRepository.delete(recoverCode.id);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  public async sendUserCode(dto: SendCodeDto): Promise<CustomResponseType> {
    const user = await this.getUserByEmail(dto.email);
    if (!user) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.NOT_FOUND, property: 'email' }],
      });
    }
    if (dto.codeType == CodeTypeEnum.VERIFICATION && !!user.isVerified) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        errorTypeCode: CustomErrorTypeEnum.USER_ALREADY_VERIFIED,
      });
    }

    await this.createUserCode(user, dto.codeType);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async readUserData(userId: string): Promise<CustomResponseType> {
    const userEntity = await getUser(userId);

    if (!userEntity) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.INCORRECT_CREDENTIALS,
      });
    }
    const userLanguagesEntity = await this.userLanguagesRepository.find({
      where: { user: { id: userId } },
      relations: {
        language: true,
      },
      select: {
        id: true,
        proficiency: true,
        language: {
          code: true,
          title: true,
          native: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: {
        user: { ...userEntity, userLanguages: userLanguagesEntity },
      },
    };
  }

  public async update(dto: UpdateUserDto, userId: string): Promise<CustomResponseType> {
    isEmptyObject(dto);

    const postgresQueryRunner = PostgresDataSource.createQueryRunner();

    try {
      await postgresQueryRunner.connect().then(async () => await postgresQueryRunner.startTransaction());

      if (dto?.phone) {
        const parsedPhone = parsePhoneNumber(dto.phone, dto.phoneCountryCode);
        dto.phone = parsedPhone.nationalNumber;

        const phone = await postgresQueryRunner.manager.count(UserEntity, { where: { id: Not(userId), phone: dto.phone } });
        if (phone) {
          throw ValidationErrorTypeEnum.IS_UNIQUE;
        }
      }

      await postgresQueryRunner.manager.update(UserEntity, { id: userId }, dto);

      await postgresQueryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await postgresQueryRunner.rollbackTransaction();

      if (e === ValidationErrorTypeEnum.IS_UNIQUE) {
        throw new CustomException({
          statusCode: HttpStatus.CONFLICT,
          validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE, property: 'phone' }],
        });
      }

      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await postgresQueryRunner.release();
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
      await this.usersRepository.update(userId, { avatarUrl: uploadedFile });
    } catch (e) {
      console.log(e);
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
      await this.usersRepository.update(userId, { avatarUrl: null });
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async createUserLanguage(dto: CreateUserLanguageDto, userId: string): Promise<CustomResponseType> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const userLanguage of dto.userLanguages) {
        const uniqueCheck = await queryRunner.manager.query(
          `SELECT id
           FROM "UserLanguage"
           WHERE "userId" = $1
             AND "languageId" = $2`,
          [userId, userLanguage.language],
        );
        if (uniqueCheck.length > 0) {
          throw ValidationErrorTypeEnum.IS_UNIQUE;
        }
        await queryRunner.manager.query('INSERT INTO "UserLanguage" (id, proficiency, "userId", "languageId") VALUES (DEFAULT, $1, $2, $3);', [
          userLanguage.proficiency,
          userId,
          userLanguage.language,
        ]);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
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
      await queryRunner.release();
    }

    const updatedUserLanguagesEntity = await this.userLanguagesRepository.find({
      where: { user: { id: userId } },
      relations: {
        language: true,
      },
      select: {
        id: true,
        proficiency: true,
        language: {
          code: true,
          title: true,
          native: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: { user: { userLanguages: updatedUserLanguagesEntity } },
    };
  }

  public async deleteUserLanguage(dto: DeleteUserLanguageDto, userId: string): Promise<CustomResponseType> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const userLanguage of dto.userLanguages) {
        const accessCheck = await queryRunner.manager.query(
          `SELECT id
           FROM "UserLanguage"
           WHERE "userId" = $1
             AND id = $2`,
          [userId, userLanguage],
        );
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
    const user = await this.usersRepository.findOne({ where: { id } });
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

    user.password = dto.newPassword;
    await this.usersRepository.update(id, user);

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

  /* Delete all rows from UserCode table where createdAt more than 24h */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  private async cleanExpiredCodes() {
    await this.dataSource.manager.query(
      `DELETE
       FROM "UserCode"
       WHERE "createdAt" <= NOW() - INTERVAL '1 DAY';`,
    );
  }

  private async createUserCode(userEntity: UserEntity, codeType: CodeTypeEnum): Promise<void> {
    const codeEntity = await this.userCodesRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        type: codeType,
        user: {
          email: userEntity.email,
        },
      },
      select: {
        id: true,
        createdAt: true,
        type: true,
      },
    });
    if (!!codeEntity) {
      const timeDifference = Math.abs(codeEntity['createdAt'].getTime() - new Date().getTime());
      if (timeDifference <= 30000) {
        throw new CustomException({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          data: { timeLeft: Math.abs(timeDifference - 30000) },
          errorTypeCode: CustomErrorTypeEnum.TOO_MANY_REQUESTS,
        });
      } else {
        await this.userCodesRepository.delete(codeEntity['id']);
      }
    }
    await this.sendAndSaveUserCode(codeType, userEntity);
    return;
  }

  /* Create or update new code */
  private async sendAndSaveUserCode(codeType: CodeTypeEnum, codeEntity: UserEntity): Promise<void> {
    const code = await this.generateCode();
    if (codeType == CodeTypeEnum.RECOVER) {
      await this.mailService.sendRecoverCode(codeEntity.email, codeEntity.firstName, code);
      await this.userCodesRepository.insert({
        value: code,
        type: codeType,
        user: { id: codeEntity.id },
      });
    } else if (codeType == CodeTypeEnum.VERIFICATION) {
      await this.mailService.sendConfirmationCode(codeEntity.email, codeEntity.firstName, code);
      await this.userCodesRepository.insert({
        value: code,
        type: codeType,
        user: { id: codeEntity.id },
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
      isExists = await this.userCodesRepository.findOne({
        where: { value: code },
      });
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
