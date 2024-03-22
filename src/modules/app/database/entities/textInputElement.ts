import { BaseElementFields } from './baseElementFields';
import { RowElementEnum } from './postgres/row.entity';
import { getDefaultStyle, StyleFields } from './styleFields';

export class TextInputElement extends BaseElementFields {
  type: RowElementEnum = RowElementEnum.INPUT;
  style: StyleFields = getDefaultStyle(RowElementEnum.INPUT);
  value: string = null;
  placeholder: string = null;
  variableId: string = null;
  variableValue: string = null;
}
