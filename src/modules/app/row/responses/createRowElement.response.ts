import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/responses/ok.response';
import { RowHeightEnum } from 'src/modules/app/database/entities/postgres/row.entity';
import { elementsArray } from '../../../../common/types/elementsArray.type';

class CreateRowElementOkSlideKeys {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  position: number;
}

class CreateRowElementOkDataRowKeys {
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

  @ApiProperty()
  slide: CreateRowElementOkSlideKeys;
}

class CreateRowElementOkData {
  @ApiProperty()
  row: CreateRowElementOkDataRowKeys;
}

export class CreateRowElement200Response extends OkResponse {
  @ApiProperty()
  data: CreateRowElementOkData;
}
