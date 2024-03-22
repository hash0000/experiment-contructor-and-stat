import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from '../../../../common/responses/ok.response';
import { ExperimentEntityFields } from './experimentEntity.response';

class ReadExperimentsResponse200Data {
  @ApiProperty()
  readonly total: number;

  @ApiProperty({ type: [ExperimentEntityFields] })
  readonly experiments: ExperimentEntityFields[];
}

export class ReadExperiments200Response extends OkResponse {
  @ApiProperty()
  readonly data: ReadExperimentsResponse200Data;
}
