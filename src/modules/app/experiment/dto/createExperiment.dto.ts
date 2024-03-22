import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNumber, IsString, Length, Validate } from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { ExperimentPlatformEnum } from '../../database/entities/experiment.entity';

export class CreateExperimentDto {
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 256)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly title: string;

  @ApiProperty()
  @Length(1, 256)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly creators: string;

  @ApiProperty({
    enum: ExperimentPlatformEnum,
  })
  @IsEnum(ExperimentPlatformEnum)
  @IsNumber()
  @IsDefined()
  readonly platform: ExperimentPlatformEnum;
}
