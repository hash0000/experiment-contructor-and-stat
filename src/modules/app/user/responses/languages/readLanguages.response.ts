import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../../common/responses/ok.response';

class ReadLanguages200ResponseLanguageKeys {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly native: string;

  @ApiProperty()
  readonly region: string;
}

class ReadLanguages200ResponseData {
  @ApiProperty({ type: [ReadLanguages200ResponseLanguageKeys] })
  readonly languages: ReadLanguages200ResponseLanguageKeys[];
}

export class ReadLanguages200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadLanguages200ResponseData;
}
