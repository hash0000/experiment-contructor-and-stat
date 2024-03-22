import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';
import { elementsArray } from '../../../../common/types/elementsArray.type';

class UpdateRowElements200ResponseData {
  @ApiProperty({ type: [], example: elementsArray })
  elements: [];
}

export class UpdateRowElements200Response extends OkResponse {
  @ApiProperty()
  data: UpdateRowElements200ResponseData;
}
