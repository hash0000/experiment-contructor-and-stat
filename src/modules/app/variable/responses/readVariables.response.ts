import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { VariableResponse } from './variableEntity.response';

class ReadVariables200ResponseData {
  @ApiProperty({ type: [VariableResponse] })
  readonly variables: VariableResponse[];
}

export class ReadVariables200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadVariables200ResponseData;
}
