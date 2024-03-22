import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';
import { RowEntityResponse } from 'src/modules/app/row/responses/rowEntity.response';

class ReadByIdCycleChildDataResponse {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty({ type: [RowEntityResponse] })
  readonly rows: Array<RowEntityResponse>;
}

export class ReadByIdCycleChildResponse extends OkResponse {
  @ApiProperty()
  readonly data: ReadByIdCycleChildDataResponse;
}
