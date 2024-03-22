import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from '../../../../common/responses/created.response';
import { CycleEntityResponse } from './cycleEntity.response';

class CreateCycle201ResponseData extends CycleEntityResponse {
  @ApiProperty({ example: [] })
  readonly rows: object[];

  @ApiProperty({ example: [] })
  readonly children: object[];
}

export class CreateCycle201Response extends CreatedResponse {
  @ApiProperty()
  readonly data: CreateCycle201ResponseData;
}
