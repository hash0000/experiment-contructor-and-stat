import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsBoolean,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { RowElementEnum } from '../postgres/row.entity';
import { BaseElementFieldsDto } from './baseElementFields.dto';
import { StyleFieldsDto } from './styleFields.dto';

class SliderAnswerDto {
  @IsUUID(4)
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Length(1, 255)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly value: string;

  @IsBoolean()
  @IsDefined()
  readonly correctAnswer: boolean;
}

export class SliderElementDto extends BaseElementFieldsDto {
  @IsIn([RowElementEnum.SLIDER])
  declare readonly type: RowElementEnum;

  @ValidateNested()
  @Type(() => StyleFieldsDto)
  @IsNotEmptyObject()
  @IsObject()
  @IsDefined()
  readonly style: StyleFieldsDto;

  @ArrayMinSize(2, {})
  @ValidateNested({
    each: true,
  })
  @Type(() => SliderAnswerDto)
  @ArrayNotEmpty()
  readonly answers: Array<SliderAnswerDto>;
}
