import { v4 as uuidV4 } from 'uuid';
import { StyleFields } from './styleFields';
import { RowElementEnum } from '../postgres/row.entity';

export enum ConditionListEnum {
  getAnyAnswer,
  getConcreteAnswer,
  getNoAnswer,
}

export enum ActionListEnum {
  showElements,
  hideElements,
  finishExperiment,
  nextSlide,
  changeSlideColor,
}

export enum OperatorListEnum {
  and,
  or,
}

type ConditionItemWithOrderType = {
  order: number;
  operatorValue: OperatorListEnum;
  condition: ConditionListEnum;
  conditionData?: string;
};

type ActionsType = {
  order: number;
  action: ActionListEnum;
  actionData?: string;
};

type ConditionType = {
  id: string;
  name: string;
  conditions: ConditionItemWithOrderType[];
  actions: ActionsType[];
};

export class BaseElementFields {
  id: string = uuidV4();
  title: string = null;
  atStart = true;
  timeToShow = 0;
  type: RowElementEnum;
  style: StyleFields;
  conditions: ConditionType[] = [];
}
