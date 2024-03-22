import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { AuthUserDataResponse } from './authUserData.response';

export class SingIn200Response extends OkResponse {
  @ApiProperty()
  readonly data: AuthUserDataResponse;
}

export class SingIn202Response {
  @ApiProperty({ example: HttpStatus.ACCEPTED })
  readonly statusCode: number;

  @ApiProperty({ example: 1021 })
  readonly errorTypeCode: number;
}
