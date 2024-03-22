import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { CodeTypeEnum } from '../../database/entities/postgres/userCode.entity';

export class SendCodeDto {
  @ApiProperty({ example: 'john@mail.org', description: 'e-mail' })
  @Transform(({ value }) => trimTransformer(value, 'email'))
  @Length(6, 255)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    examples: [CodeTypeEnum.RECOVER, CodeTypeEnum.VERIFICATION],
    description: 'Code type',
  })
  @IsEnum(CodeTypeEnum)
  @IsNotEmpty()
  @IsString()
  readonly codeType: CodeTypeEnum;
}
