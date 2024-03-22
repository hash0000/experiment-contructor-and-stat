import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';

class ReadOneVariable200ResponseDataVariables {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly title: string;
}

class ReadOneVariable200ResponseData {
  @ApiProperty()
  readonly variables: ReadOneVariable200ResponseDataVariables;
}

export class AddVariableColumns200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadOneVariable200ResponseData;
}
