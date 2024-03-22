import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { IsUserName } from '../../../../common/validators/isUserName.validator';

export class CreateUserDto {
  @ApiProperty({ description: 'First name' })
  @Validate(IsUserName)
  @Transform(({ value }) => trimTransformer(value, 'firstName'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Validate(IsUserName)
  @Transform(({ value }) => trimTransformer(value, 'lastName'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ example: 'ivan@mail.org', description: 'e-mail' })
  @Transform(({ value }) => trimTransformer(value, 'email'))
  @Length(6, 255)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  // TODO: return validation for prod
  // @Validate(IsPasswordValidator)
  // @Length(6, 32)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
