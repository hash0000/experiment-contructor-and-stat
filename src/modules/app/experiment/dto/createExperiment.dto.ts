import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { ExperimentPlatformEnum } from '../../database/entities/postgres/experiment.entity';

export class CreateExperimentDto {
  @ApiProperty({ description: 'Title' })
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'title'))
  @Length(1, 256)
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @Transform(({ value }) => trimTransformer(value, 'creators'))
  @IsNotEmpty()
  @IsString()
  readonly creators: string;

  @ApiProperty({
    description: 'Platform',
    examples: [ExperimentPlatformEnum.CROSS_PLATFORM, ExperimentPlatformEnum.WEB, ExperimentPlatformEnum.MOBILE],
  })
  @IsEnum(ExperimentPlatformEnum)
  @IsNotEmpty()
  @IsString()
  readonly platform: ExperimentPlatformEnum;
}
