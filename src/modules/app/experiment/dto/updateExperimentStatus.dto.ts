import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ExperimentStatusEnum } from '../../database/entities/postgres/experiment.entity';

export class UpdateExperimentStatusDto {
  @ApiPropertyOptional({ description: 'Experiment status', examples: [ExperimentStatusEnum.PUBLISHED] })
  @IsIn([ExperimentStatusEnum.PUBLISHED, ExperimentStatusEnum.UNPUBLISHED])
  @IsNotEmpty()
  @IsString()
  readonly status: ExperimentStatusEnum;
}
