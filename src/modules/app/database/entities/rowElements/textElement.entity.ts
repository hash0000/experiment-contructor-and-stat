import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StyleElementM, StyleElementSchema } from './styleElement.entity';
import { ConditionElementEntityM, ConditionElementEntitySchema } from './conditionElement.entity';
import mongoose from 'mongoose';
import { RowElementEnum } from '../postgres/row.entity';
import { Variable } from '../variable.schema';

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class TextElementM {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, default: true })
  atStart: boolean;

  @Prop({ required: true, default: 0 })
  timeToShow: number;

  @Prop({ required: true, default: RowElementEnum.TEXT, enum: RowElementEnum })
  type: RowElementEnum;

  @Prop({ required: true, type: StyleElementSchema })
  style: StyleElementM;

  @Prop({ required: true, type: [ConditionElementEntitySchema], default: [] })
  conditions: ConditionElementEntityM;

  @Prop({ required: true, default: 'Next' })
  value: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: Variable.name })
  variableId: string;
}

const TextSchema = SchemaFactory.createForClass(TextElementM);
