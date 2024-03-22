import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { IsPasswordValidator } from 'src/common/validators/isPassword.validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'Password' })
  @Validate(IsPasswordValidator)
  @Length(6, 32)
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'New password' })
  @Validate(IsPasswordValidator)
  @Length(6, 32)
  @IsNotEmpty()
  readonly newPassword: string;
}
