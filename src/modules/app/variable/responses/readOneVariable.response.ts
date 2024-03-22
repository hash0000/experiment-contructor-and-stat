import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { VariableResponse } from './variableEntity.response';

export class ReadOneVariable200Response extends OkResponse {
  @ApiProperty()
  readonly data: VariableResponse;
}
