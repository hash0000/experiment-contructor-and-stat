import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import UserEntityResponse from './userEntity.response';

class ReadUser200ResponseLanguageKeys {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly native: string;
}

class ReadUser200ResponseUserLanguageKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly proficiency: string;

  @ApiProperty({ type: ReadUser200ResponseLanguageKeys })
  readonly language: ReadUser200ResponseLanguageKeys;
}

class ReadUser200ResponseUserKeys extends UserEntityResponse {
  @ApiProperty({ type: [ReadUser200ResponseUserLanguageKeys] })
  readonly userLanguages: ReadUser200ResponseUserLanguageKeys[];
}

class ReadUser200ResponseData {
  @ApiProperty({ type: ReadUser200ResponseUserKeys })
  readonly user: ReadUser200ResponseUserKeys;
}

export class ReadUser200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadUser200ResponseData;
}
