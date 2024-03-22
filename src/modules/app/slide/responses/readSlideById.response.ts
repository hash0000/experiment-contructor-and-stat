import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';
import { RowEntityResponse } from '../../row/responses/rowEntity.response';

class ReadSlideById200ResponseSlideKeys {
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

  @ApiProperty({ type: [RowEntityResponse] })
  readonly rows: Array<RowEntityResponse>;
}

export class ReadSlideById200ResponseData {
  @ApiProperty()
  readonly slide: ReadSlideById200ResponseSlideKeys;
}

export class ReadSlideById200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadSlideById200ResponseData;
}
