import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { elementsArray } from '../../../../common/types/elementsArray.type';
import { ExperimentEntityFields } from './experimentEntity.response';

class ReadOwnExperimentById200ResponseRowKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly height: string;

  @ApiProperty()
  readonly maxColumn: number;

  @ApiProperty()
  readonly position: number;

  @ApiProperty({ type: [], example: elementsArray })
  readonly elements: [];
}

class ReadOwnExperimentByIdOkResponseCycleDataKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly isCycle: number;

  @ApiProperty()
  readonly parent: object;
}

class ReadOwnExperimentById200ResponseFirstSlideKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly isCycle: number;

  @ApiProperty()
  readonly transitionType: number;

  @ApiProperty()
  readonly variableId: string;

  @ApiProperty()
  readonly parent: object;

  @ApiProperty({ type: [ReadOwnExperimentByIdOkResponseCycleDataKeys] })
  readonly cycleSlides: ReadOwnExperimentByIdOkResponseCycleDataKeys[];

  @ApiProperty({ type: [ReadOwnExperimentById200ResponseRowKeys] })
  readonly rows: ReadOwnExperimentById200ResponseRowKeys[];
}

class ReadOwnExperimentByIdOkResponseDataKeysSlideData {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly isCycle: number;

  @ApiProperty()
  readonly transitionType: number;

  @ApiProperty()
  readonly variableId: string;

  @ApiProperty()
  readonly parent: object;

  @ApiProperty({ type: [ReadOwnExperimentByIdOkResponseCycleDataKeys] })
  readonly cycleSlides: ReadOwnExperimentByIdOkResponseCycleDataKeys[];
}

class ReadOwnExperimentById200ResponseExperimentKeys extends ExperimentEntityFields {
  @ApiProperty({ type: [ReadOwnExperimentByIdOkResponseDataKeysSlideData] })
  readonly slides: Array<ReadOwnExperimentByIdOkResponseDataKeysSlideData>;
}

class ReadOwnExperimentById200ResponseData {
  @ApiProperty()
  readonly experiment: ReadOwnExperimentById200ResponseExperimentKeys;

  @ApiProperty()
  readonly firstSlide: ReadOwnExperimentById200ResponseFirstSlideKeys;
}

export class ReadOwnExperimentById200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadOwnExperimentById200ResponseData;
}
