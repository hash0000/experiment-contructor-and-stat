import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Validate } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { ExperimentOrderOptionEnum, ExperimentSortOptionEnum, ExperimentStatusEnum } from '../../database/entities/postgres/experiment.entity';

export class ReadExperimentsDto {
  @ApiProperty({
    description: 'Sort by option',
  })
  @IsEnum(ExperimentSortOptionEnum)
  @IsNotEmpty()
  @IsString()
  readonly sortBy: ExperimentSortOptionEnum;

  @ApiProperty({
    description: 'Order by option',
  })
  @IsEnum(ExperimentOrderOptionEnum)
  @IsNotEmpty()
  @IsString()
  readonly order: ExperimentOrderOptionEnum;

  @ApiPropertyOptional({
    description: 'Search query',
  })
  @Validate(IsGeneralValidationValidator)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly query?: string;

  @ApiPropertyOptional({
    description: 'Experiment status',
  })
  @IsEnum(ExperimentStatusEnum)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly experimentStatus?: ExperimentStatusEnum;
}
