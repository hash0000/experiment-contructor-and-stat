import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate, ValidateIf } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { IsUserName } from '../../../../common/validators/isUserName.validator';
import { IsSameOrAfterNow } from '../../../../common/validators/user/IsSameOrAfterNow.constraint';
import { UserSexEnum } from '../../database/entities/postgres/user.entity';
import { IsValidPhone } from '../../../../common/validators/user/isValidPhone.validator';
import { PhoneCountryCodeArray } from '../../../../common/constants/phoneCountryCode.constant';
import { ShouldOrNotExistsByProperty } from '../../../../common/validators/shouldOrNotExistsByProperty.validator';
import { CountryCode } from 'libphonenumber-js/types';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @Validate(IsUserName)
  @Transform(({ value }) => trimTransformer(value, 'firstName'), { toClassOnly: true })
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiPropertyOptional({ example: 'Depp', description: 'Last name' })
  @Validate(IsUserName)
  @Transform(({ value }) => trimTransformer(value, 'lastName'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Christopher' })
  @Validate(IsUserName)
  @Transform(({ value }) => trimTransformer(value, 'middleName'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly middleName?: string;

  @ApiPropertyOptional({ description: 'Birthday', example: '2022-12-08' })
  @IsSameOrAfterNow()
  @IsDateString()
  @IsDefined()
  @IsOptional()
  readonly birthday?: Date;

  @ApiPropertyOptional()
  @IsIn(PhoneCountryCodeArray)
  @IsString()
  @ShouldOrNotExistsByProperty('phone')
  @ValidateIf((object, value) => !!(object.phone || value))
  readonly phoneCountryCode?: CountryCode;

  @ApiPropertyOptional()
  @IsValidPhone('phoneCountryCode')
  @IsString()
  @ShouldOrNotExistsByProperty('phoneCountryCode')
  @ValidateIf((object, value) => !!(object.phoneCountryCode || value))
  phone?: string;

  @ApiPropertyOptional({ description: 'Laboratory', example: 'West Coast Laboratory' })
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'laboratory'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly laboratory?: string;

  @ApiPropertyOptional({ description: 'Specialization', example: 'Fake specialization' })
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'specialization'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly specialization?: string;

  @ApiPropertyOptional({
    description: 'Sex',
    examples: [UserSexEnum.NOT_KNOWN, UserSexEnum.MALE, UserSexEnum.FEMALE],
  })
  @IsEnum(UserSexEnum)
  @IsNumber()
  @IsDefined()
  @IsOptional()
  readonly sex?: UserSexEnum;
}
