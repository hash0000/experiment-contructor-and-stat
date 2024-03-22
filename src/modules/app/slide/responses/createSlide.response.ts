import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from '../../../../common/responses/created.response';
import { elementsArray } from '../../../../common/types/elementsArray.type';

class CreateSlide201ResponseRowKeys {
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

class CreateSlide201ResponseExperimentKeys {
  @ApiProperty()
  readonly id: string;
}

class CreateSlide201ResponseSlideKeys {
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

  @ApiProperty({ type: [CreateSlide201ResponseRowKeys] })
  readonly rows: CreateSlide201ResponseRowKeys[];

  @ApiProperty()
  readonly experiment: CreateSlide201ResponseExperimentKeys;
}

class CreateSlide201ResponseData {
  @ApiProperty()
  readonly slide: CreateSlide201ResponseSlideKeys;
}

export class CreateSlide201Response extends CreatedResponse {
  @ApiProperty()
  readonly data: CreateSlide201ResponseData;
}
