import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { ExperimentSortOptionEnum, ExperimentStatusEnum } from '../../database/entities/experiment.entity';
import { OrderByEnum } from '../../../../common/enums/orderBy.enum';

export class ReadExperimentsDto {
  @ApiProperty()
  @IsEnum(ExperimentSortOptionEnum)
  @IsNotEmpty()
  @IsString()
  readonly sortBy: ExperimentSortOptionEnum;

  @ApiProperty({
    enum: OrderByEnum,
  })
  @IsEnum(OrderByEnum)
  @IsNotEmpty()
  @IsString()
  readonly order: string;

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly query?: string;

  @ApiPropertyOptional()
  @IsEnum(ExperimentStatusEnum)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly experimentStatus?: ExperimentStatusEnum;
}
