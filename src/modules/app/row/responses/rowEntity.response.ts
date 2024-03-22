import { ApiProperty } from '@nestjs/swagger';
import { RowHeightEnum } from 'src/modules/app/database/entities/postgres/row.entity';
import { elementsArray } from '../../../../common/types/elementsArray.type';

export class RowEntityResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  height: RowHeightEnum;

  @ApiProperty()
  maxColumn: number;

  @ApiProperty()
  position: number;

  @ApiProperty({ type: [], example: elementsArray })
  readonly elements: [];
}
