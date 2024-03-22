import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';
import { ExperimentEntityFields } from './experimentEntity.response';

class UpdateExperimentSettingsOkResponseData {
  @ApiProperty()
  readonly experiment: ExperimentEntityFields;
}

export class UpdateExperimentSettings200Response extends OkResponse {
  @ApiProperty()
  readonly data: UpdateExperimentSettingsOkResponseData;
}
