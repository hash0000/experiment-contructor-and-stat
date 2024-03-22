import { v4 as uuidV4 } from 'uuid';
import { BaseElementFields } from './baseElementFields';
import { getDefaultStyle, StyleFields } from './styleFields';
import { RowElementEnum } from '../postgres/row.entity';

class SliderAnswer {
  id: string = uuidV4();

  value: string | null = null;

  correctAnswer = false;
}

export class SliderElement extends BaseElementFields {
  type: RowElementEnum = RowElementEnum.SLIDER;

  style: StyleFields = getDefaultStyle(RowElementEnum.SLIDER);

  answers: Array<SliderAnswer> = getDefaultAnswers();
}

function getDefaultAnswers(): Array<SliderAnswer> {
  const answers = [{ ...new SliderAnswer() }, { ...new SliderAnswer() }];
  answers[0].correctAnswer = true;
  answers[0].value = 'Ответ 1';
  answers[1].value = 'Ответ 2';

  return answers;
}
