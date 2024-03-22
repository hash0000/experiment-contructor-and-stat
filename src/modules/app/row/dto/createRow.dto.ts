import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { RowMaxColumnEnum } from 'src/modules/app/database/entities/postgres/row.entity';

export class CreateRowDto {
  @ApiProperty({
    description: 'Max rowElement in column. Possible values: 1, 2, 3',
    example: 1,
    enum: RowMaxColumnEnum,
    isArray: true,
    examples: [RowMaxColumnEnum.ONE, RowMaxColumnEnum.TWO, RowMaxColumnEnum.THREE],
  })
  @IsEnum(RowMaxColumnEnum)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsDefined()
  maxColumn: number;
}
