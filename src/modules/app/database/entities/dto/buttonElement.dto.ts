import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsIn, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../../common/validators/isGeneralValidation.validator';
import { ButtonActionEnum } from '../elements/buttonElement';
import { RowElementEnum } from '../postgres/row.entity';
import { BaseElementFieldsDto } from './baseElementFields.dto';
import { StyleFieldsDto } from './styleFields.dto';

export class ButtonElementDto extends BaseElementFieldsDto {
  @IsIn([RowElementEnum.BUTTON])
  declare readonly type: RowElementEnum;

  @IsEnum(ButtonActionEnum)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsDefined()
  readonly action: ButtonActionEnum;

  @Validate(IsGeneralValidationValidator)
  @Length(1, 255)
  @IsString()
  @IsNotEmpty()
  readonly value: string;

  @ValidateNested()
  @Type(() => StyleFieldsDto)
  @IsNotEmptyObject()
  @IsObject()
  @IsDefined()
  readonly style: StyleFieldsDto;
}
