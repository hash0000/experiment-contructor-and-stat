import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RowElementEnum } from 'src/modules/app/database/entities/postgres/row.entity';

export class CreateRowElementDto {
  @ApiProperty({
    description: 'Row element type. Possible values: text',
    enum: RowElementEnum,
    examples: RowElementEnum,
  })
  @IsEnum(RowElementEnum)
  @IsNotEmpty()
  @IsString()
  readonly type: RowElementEnum;

  @ApiProperty()
  @Max(3)
  @Min(1)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsDefined()
  readonly position: number;
}
