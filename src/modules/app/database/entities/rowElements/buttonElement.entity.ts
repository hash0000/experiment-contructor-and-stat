import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StyleElementM, StyleElementSchema } from './styleElement.entity';
import { ConditionElementEntityM, ConditionElementEntitySchema } from './conditionElement.entity';
import { RowElementEnum } from '../postgres/row.entity';

enum ButtonActionEnum {
  NEXT_SLIDE = 100,
}

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class ButtonElementM {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, default: true })
  atStart: boolean;

  @Prop({ required: true, default: 0 })
  timeToShow: number;

  @Prop({ required: true, default: RowElementEnum.BUTTON, enum: RowElementEnum })
  type: RowElementEnum;

  @Prop({ required: true, type: StyleElementSchema })
  style: StyleElementM;

  @Prop({ required: true, type: [ConditionElementEntitySchema], default: [] })
  conditions: ConditionElementEntityM;

  @Prop({ required: true, default: ButtonActionEnum.NEXT_SLIDE, enum: ButtonActionEnum })
  action: ButtonActionEnum;

  @Prop({ required: true, default: 'Next' })
  value: string;
}

const ButtonElementSchema = SchemaFactory.createForClass(ButtonElementM);
