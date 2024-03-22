import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from 'src/common/responses/created.response';
import { RowHeightEnum } from 'src/modules/app/database/entities/postgres/row.entity';
import { elementsArray } from '../../../../common/types/elementsArray.type';

class CreateRow201ResponseRowKeys {
  @ApiProperty()
  id: string;

  @ApiProperty()
  height: RowHeightEnum;

  @ApiProperty()
  maxColumn: number;

  @ApiProperty()
  position: number;

  @ApiProperty({ type: [], example: elementsArray })
  elements: [];
}

export class CreateRow201ResponseData {
  @ApiProperty()
  row: CreateRow201ResponseRowKeys;
}

export class CreateRow201Response extends CreatedResponse {
  @ApiProperty()
  data: CreateRow201ResponseData;
}
