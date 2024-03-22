import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { trimTransformer } from '../../../../common/transformers/trim.transformer';
import { IsPasswordValidator } from '../../../../common/validators/isPassword.validator';
import { IsUserCodeValidator } from '../../../../common/validators/isUserCode.validator';

export class RecoverUserPasswordDto {
  @ApiProperty({ example: '123456', description: 'Code' })
  @Transform(({ value }) => trimTransformer(value, 'code'))
  @Validate(IsUserCodeValidator)
  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty({ description: 'Password' })
  @Validate(IsPasswordValidator)
  @Length(6, 32)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
