import { BaseElementFields } from './baseElementFields';
import { RowElementEnum } from '../postgres/row.entity';
import { getDefaultStyle, StyleFields } from './styleFields';

export class TextFieldElement extends BaseElementFields {
  type: RowElementEnum = RowElementEnum.TEXT;
  style: StyleFields = getDefaultStyle(RowElementEnum.TEXT);
  value: string = null;
  variableId: string = null;
}
