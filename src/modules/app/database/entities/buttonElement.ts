import { BaseElementFields } from './baseElementFields';
import { RowElementEnum } from './postgres/row.entity';
import { getDefaultStyle, StyleFields } from './styleFields';

export enum ButtonActionEnum {
  NEXT_SLIDE = 100,
}

export class ButtonElement extends BaseElementFields {
  type: RowElementEnum = RowElementEnum.BUTTON;

  style: StyleFields = getDefaultStyle(RowElementEnum.BUTTON);

  action: ButtonActionEnum = ButtonActionEnum.NEXT_SLIDE;

  value = 'Далее';
}
