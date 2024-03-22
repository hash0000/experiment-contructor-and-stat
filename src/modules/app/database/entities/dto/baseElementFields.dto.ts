import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Length, ValidateIf, ValidateNested } from 'class-validator';
import { RowElementEnum } from 'src/modules/app/database/entities/postgres/row.entity';
import { IsNotBlank } from '../../../../../common/validators/isNotBlank.constraint';
import { OperatorListEnum, ConditionListEnum, ActionListEnum } from '../elements/baseElementFields';

class ConditionItemWithOrder {
  @IsNumber()
  @IsDefined()
  readonly order: number;

  @IsEnum(OperatorListEnum)
  @IsDefined()
  readonly operatorValue: OperatorListEnum;

  @IsEnum(ConditionListEnum)
  @IsDefined()
  readonly condition: ConditionListEnum;

  @IsNotBlank()
  @IsString()
  @IsDefined()
  @ValidateIf((object, value) => value !== null)
  readonly conditionData: string | null;
}

class Actions {
  @IsNumber()
  @IsDefined()
  readonly order: number;

  @IsEnum(ActionListEnum)
  @IsDefined()
  readonly action: ActionListEnum;

  @IsNotBlank()
  @IsString()
  @IsDefined()
  @ValidateIf((object, value) => value !== null)
  readonly actionData: string | null;
}

class Condition {
  @IsUUID(4)
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly name: string;

  @Type(() => ConditionItemWithOrder)
  @ValidateNested({ each: true })
  @IsArray()
  @IsDefined()
  readonly conditions: ConditionItemWithOrder[];

  @Type(() => Actions)
  @ValidateNested({ each: true })
  @IsArray()
  @IsDefined()
  readonly actions: Actions[];
}

export class BaseElementFieldsDto {
  @IsUUID(4)
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Length(1, 127)
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsDefined()
  readonly timeToShow: number;

  @IsBoolean()
  @IsDefined()
  readonly atStart: boolean;

  @IsEnum(RowElementEnum)
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @Type(() => Condition)
  @ValidateNested({ each: true })
  @IsArray()
  @IsDefined()
  readonly conditions: Condition[];
}
