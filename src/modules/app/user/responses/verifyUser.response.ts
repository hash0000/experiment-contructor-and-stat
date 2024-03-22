import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { AuthUserDataResponse } from './authUserData.response';

export class VerifyUser200Response extends OkResponse {
  @ApiProperty()
  readonly data: AuthUserDataResponse;
}
