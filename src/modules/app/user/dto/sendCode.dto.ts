import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserCodeTypeEnum } from '../../database/entities/userCode.entity';

export class SendCodeDto {
  @ApiProperty({ example: 'john@mail.org', description: 'e-mail' })
  @Length(6, 255)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    examples: [UserCodeTypeEnum.RECOVER, UserCodeTypeEnum.VERIFICATION],
    description: 'Code type',
  })
  @IsEnum(UserCodeTypeEnum)
  @IsNotEmpty()
  readonly codeType: UserCodeTypeEnum;
}
