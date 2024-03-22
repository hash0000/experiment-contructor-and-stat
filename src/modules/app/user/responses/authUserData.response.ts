import { ApiProperty } from '@nestjs/swagger';
import UserEntityResponse from 'src/modules/app/user/responses/userEntity.response';

class AuthUserDataResponseTokenKeys {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9.5NTYsImV4czPhUY',
  })
  readonly accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCIf-Liq0vkkOtXgSxVzFN1zjzQ',
  })
  readonly refreshToken: string;
}

export class AuthUserDataResponse {
  @ApiProperty()
  readonly tokens: AuthUserDataResponseTokenKeys;

  @ApiProperty()
  readonly user: UserEntityResponse;
}
