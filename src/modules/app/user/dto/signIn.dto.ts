import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';

export class SignInDto {
  @ApiProperty({ example: 'ivan@mail.org', description: 'e-mail' })
  @Transform(({ value }) => trimTransformer(value, 'email'))
  @Length(6, 255)
  @IsEmail({ ignore_max_length: true })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'Password' })
  @Length(6, 32)
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
