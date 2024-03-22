import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, Length, Validate, ValidateIf, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../../common/validators/isGeneralValidation.validator';
import { RowElementEnum } from '../postgres/row.entity';
import { BaseElementFieldsDto } from './baseElementFields.dto';
import { StyleFieldsDto } from './styleFields.dto';

export class TextFieldElementDto extends BaseElementFieldsDto {
  @IsIn([RowElementEnum.TEXT])
  declare readonly type: RowElementEnum;

  @ValidateNested()
  @Type(() => StyleFieldsDto)
  @IsNotEmptyObject()
  @IsObject()
  @IsDefined()
  readonly style: StyleFieldsDto;

  @Validate(IsGeneralValidationValidator)
  @Length(1, 1000)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  readonly value: string;

  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly variableId: string;
}
