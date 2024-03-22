import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum ConditionActionEnum {
  showElements,
  hideElements,
  finishExperiment,
  nextSlide,
  changeSlideColor,
}

enum ConditionOperatorEnum {
  and,
  or,
}

enum ConditionConditionEnum {
  getAnyAnswer,
  getConcreteAnswer,
  getNoAnswer,
}

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class ActionsProperty {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true, enum: ConditionActionEnum })
  action: ConditionActionEnum;

  @Prop()
  actionData: string;
}

const ActionsPropertySchema = SchemaFactory.createForClass(ActionsProperty);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class ConditionsProperty {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true, enum: ConditionOperatorEnum })
  operatorValue: ConditionOperatorEnum;

  @Prop({ required: true, enum: ConditionConditionEnum })
  condition: ConditionConditionEnum;

  @Prop()
  conditionData: string;
}

const ConditionsPropertySchema = SchemaFactory.createForClass(ConditionsProperty);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class ConditionElementEntityM {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [ConditionsPropertySchema], default: [] })
  conditions: ConditionsProperty[];

  @Prop({ required: true, type: [ActionsPropertySchema], default: [] })
  actions: ActionsProperty;
}

export const ConditionElementEntitySchema = SchemaFactory.createForClass(ConditionElementEntityM);
