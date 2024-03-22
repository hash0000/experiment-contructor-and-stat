import { IsDefined, IsEnum } from 'class-validator';
import { ExperimentStatusEnum } from '../../database/entities/experiment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExperimentStatusDto {
  @ApiProperty({ enum: ExperimentStatusEnum })
  @IsEnum(ExperimentStatusEnum)
  @IsDefined()
  readonly status: ExperimentStatusEnum;
}
