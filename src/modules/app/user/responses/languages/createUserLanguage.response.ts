import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../../common/responses/ok.response';

class ReadUserData200ResponseLanguageKeys {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly native: string;
}

class CreateUserLanguage200ResponseUserLanguageKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly proficiency: string;

  @ApiProperty()
  readonly language: ReadUserData200ResponseLanguageKeys;
}

class CreateUserLanguage200ResponseUserKeys {
  @ApiProperty({ type: [CreateUserLanguage200ResponseUserLanguageKeys] })
  readonly userLanguages: CreateUserLanguage200ResponseUserLanguageKeys[];
}

class CreateUserLanguage200ResponseData {
  @ApiProperty()
  readonly user: CreateUserLanguage200ResponseUserKeys;
}

export class CreateUserLanguage200Response extends OkResponse {
  @ApiProperty()
  readonly data: CreateUserLanguage200ResponseData;
}
