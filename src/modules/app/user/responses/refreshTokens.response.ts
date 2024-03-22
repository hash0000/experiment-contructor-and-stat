import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';

class RefreshTokens200ResponseTokenKeys {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9.5NTYsImV4czPhUY',
  })
  readonly accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCIf-Liq0vkkOtXgSxVzFN1zjzQ',
  })
  readonly refreshToken: string;
}

class RefreshTokens200ResponseData {
  @ApiProperty()
  readonly tokens: RefreshTokens200ResponseTokenKeys;
}

export class RefreshTokens200Response extends OkResponse {
  @ApiProperty()
  readonly data: RefreshTokens200ResponseData;
}
