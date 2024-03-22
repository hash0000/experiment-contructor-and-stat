import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from '../../../../common/responses/created.response';
import { ExperimentEntityFields } from './experimentEntity.response';

class CreateExperiment201ResponseSlideKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly positionInCycle: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly isCycle: number;

  @ApiProperty({ type: [Object] })
  readonly rows: object[];
}

class CreateExperiment201ResponseDataKeys extends ExperimentEntityFields {
  @ApiProperty({ type: [CreateExperiment201ResponseSlideKeys] })
  readonly slides: CreateExperiment201ResponseSlideKeys[];
}

class CreateExperiment201ResponseData {
  @ApiProperty()
  readonly experiment: CreateExperiment201ResponseDataKeys;
}

export class CreateExperiment201Response extends CreatedResponse {
  @ApiProperty()
  readonly data: CreateExperiment201ResponseData;
}
