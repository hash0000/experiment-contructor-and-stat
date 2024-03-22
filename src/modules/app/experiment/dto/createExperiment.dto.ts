import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString, Length, Validate } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { ExperimentPlatformEnum } from '../../database/entities/postgres/experiment.entity';
import { IsNotBlank } from '../../../../common/validators/isNotBlank.constraint';

export class CreateExperimentDto {
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 256)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly title: string;

  @ApiProperty()
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly creators: string;

  @ApiProperty({ enum: ExperimentPlatformEnum })
  @IsEnum(ExperimentPlatformEnum)
  @IsDefined()
  readonly platform: ExperimentPlatformEnum;
}
