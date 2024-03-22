import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsMongoId, IsNotEmptyObject, IsObject, IsString, MaxLength, Validate, ValidateIf, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from '../../../../../common/validators/isGeneralValidation.validator';
import { RowElementEnum } from '../postgres/row.entity';
import { BaseElementFieldsDto } from './baseElementFields.dto';
import { StyleFieldsDto } from './styleFields.dto';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';

export class TextInputElementDto extends BaseElementFieldsDto {
  @IsIn([RowElementEnum.INPUT])
  declare readonly type: RowElementEnum;

  @ValidateNested()
  @Type(() => StyleFieldsDto)
  @IsNotEmptyObject()
  @IsObject()
  @IsDefined()
  readonly style: StyleFieldsDto;

  @Validate(IsGeneralValidationValidator)
  @MaxLength(1000)
  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly value: string;

  @Validate(IsGeneralValidationValidator)
  @MaxLength(1000)
  @IsString()
  @ValidateIf((object, value) => value !== null)
  readonly placeholder: string;

  @IsMongoId()
  @IsString()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly variableId: string;

  @MaxLength(255)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly variableValue: string;
}
