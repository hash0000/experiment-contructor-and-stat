import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from '../../../../../common/responses/created.response';
import { CycleChildEntityResponse } from './cycleChildEntity.response';

class CreateCycleChild201ResponseData extends CycleChildEntityResponse {
  @ApiProperty({ example: [] })
  readonly rows: object[];
}

export class CreateCycleChild201Response extends CreatedResponse {
  @ApiProperty()
  readonly data: CreateCycleChild201ResponseData;
}
