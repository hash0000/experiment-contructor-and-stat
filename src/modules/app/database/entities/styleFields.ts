import { RowElementEnum } from './postgres/row.entity';

export class StyleFields {
  mainColor: string = null;

  secondColor: string = null;

  thirdColor: string = null;

  fontSize: number = null;

  position: number = null;
}

export function getDefaultStyle(elementType: RowElementEnum | 'answer'): StyleFields {
  const styleFields = new StyleFields();
  switch (elementType) {
    case RowElementEnum.BUTTON:
      styleFields.mainColor = '#FFFFFF';
      styleFields.secondColor = '#1976D2';
      styleFields.fontSize = 16;
      styleFields.position = 1;
      break;
    case RowElementEnum.SLIDER:
      styleFields.mainColor = '#000000';
      styleFields.secondColor = '#1976D2';
      styleFields.thirdColor = '#1976D2';
      styleFields.fontSize = 16;
      styleFields.position = 1;
      break;
    case RowElementEnum.TEXT:
      styleFields.mainColor = '#000000';
      styleFields.secondColor = '#FFFFFF';
      styleFields.fontSize = 16;
      styleFields.position = 1;
      break;
    case RowElementEnum.INPUT:
      styleFields.mainColor = '#000000';
      styleFields.secondColor = '#FFFFFF';
      styleFields.fontSize = 16;
      styleFields.position = 1;
      break;
  }
  return styleFields;
}
