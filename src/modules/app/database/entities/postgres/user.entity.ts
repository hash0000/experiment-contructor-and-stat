import { HttpStatus } from '@nestjs/common';
import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { CustomErrorTypeEnum } from 'src/common/enums/errorType.enum';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserSexEnum {
  NOT_KNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

@Entity({ name: 'User' })
export class UserEntityP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 255,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 255,
  })
  lastName: string;

  @Column({
    nullable: true,
    length: 255,
  })
  middleName: string;

  @Column({
    unique: true,
    nullable: false,
    length: 255,
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  phoneCountryCode: string;

  @Column({
    unique: true,
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
    type: 'date',
  })
  birthday: Date;

  @Column({
    nullable: true,
  })
  laboratory: string;

  @Column({
    nullable: true,
  })
  specialization: string;

  @Column({
    nullable: false,
    default: UserSexEnum.NOT_KNOWN,
    type: 'smallint',
  })
  sex: UserSexEnum;

  @Column({
    nullable: true,
  })
  avatarUrl: string;

  @Column({
    nullable: false,
    default: false,
  })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  preparePhoneField() {
    if (typeof this.phone === 'string' && this.phone.length && typeof this.phoneCountryCode === 'string' && this.phoneCountryCode.length) {
      const phoneNumber = parsePhoneNumber(this.phone, this.phoneCountryCode as CountryCode);
      this.phone = phoneNumber.formatInternational();
    }
    if (typeof this.phone === 'string' && this.phone.length && typeof this.phoneCountryCode !== 'string') {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorTypeCode: CustomErrorTypeEnum.BAD_REQUEST_IN_ENTITY,
      });
    }
  }

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await hashPassword(this.password);
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    this.password = await hashPassword(this.password);
  }
}

export async function hashPassword(password: UserEntityP['password']) {
  return await argon.hash(password, {
    type: 2,
    salt: Buffer.from(process.env.SALT, 'utf-8'),
  });
}
