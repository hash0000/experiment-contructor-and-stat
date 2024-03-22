import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsDateFromNumber } from '../../../../common/validators/isDateFromNumber.validator';
import { RowElementEnum } from '../../../app/database/entities/postgres/row.entity';

export class UpdateStatisticDataDto {
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  elementTitle: string;

  @ApiProperty({ enum: RowElementEnum })
  @IsEnum(RowElementEnum)
  @IsString()
  @IsDefined()
  elementType: RowElementEnum;

  @ApiProperty()
  @IsDateFromNumber()
  @IsNumber()
  @IsDefined()
  jsTimestamp: number;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  actionType: number;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  isAnswer: boolean;

  @ApiProperty()
  @IsNotBlank()
  @IsString()
  @IsDefined()
  @IsOptional()
  value?: string;
}
