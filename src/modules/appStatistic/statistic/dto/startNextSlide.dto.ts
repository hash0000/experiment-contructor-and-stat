import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString, IsUUID, Validate } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsDateFromNumber } from '../../../../common/validators/isDateFromNumber.validator';

export class StartNextSlideDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  @IsDefined()
  @IsOptional()
  previousSlideId?: string;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsDefined()
  slideId: string;

  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  slideTitle: string;

  @ApiProperty()
  @IsDateFromNumber()
  @IsNumber()
  @IsDefined()
  jsStartTimestamp: number;
}
