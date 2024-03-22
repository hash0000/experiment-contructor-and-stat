import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';

class DeleteRow200ResponseRowKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly position: number;
}

export class DeleteRow200ResponseData {
  @ApiProperty({ type: [DeleteRow200ResponseRowKeys] })
  rows: DeleteRow200ResponseRowKeys[];
}

export class DeleteRow200Response extends OkResponse {
  @ApiProperty()
  data: DeleteRow200ResponseData;
}
