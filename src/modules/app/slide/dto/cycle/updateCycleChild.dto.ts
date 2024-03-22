import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { IsGeneralValidationValidator } from '../../../../../common/validators/isGeneralValidation.validator';

export class UpdateCycleChildDto {
  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'title'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional()
  @IsPositive()
  @IsInt()
  @IsDefined()
  @IsOptional()
  readonly position?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsDefined()
  @IsOptional()
  readonly training?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsDefined()
  @IsOptional()
  readonly autoTransition?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsDefined()
  @IsOptional()
  readonly timeForTransition?: number;

  @ApiPropertyOptional()
  @IsHexColor()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly colorCode?: string;
}
