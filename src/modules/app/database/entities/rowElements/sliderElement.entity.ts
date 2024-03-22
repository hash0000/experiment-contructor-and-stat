import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StyleElementM, StyleElementSchema } from './styleElement.entity';
import { ConditionElementEntityM, ConditionElementEntitySchema } from './conditionElement.entity';
import { RowElementEnum } from '../postgres/row.entity';

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class SliderAnswerProperty {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true, default: false })
  correctAnswer: boolean;
}

const SliderAnswerPropertySchema = SchemaFactory.createForClass(SliderAnswerProperty);

function getDefaultAnswers(): SliderAnswerProperty[] {
  const answers = [{ ...new SliderAnswerProperty() }, { ...new SliderAnswerProperty() }];
  answers[0].correctAnswer = true;
  answers[0].value = 'Answer 1';
  answers[1].value = 'Answer 2';

  return answers;
}

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class SliderElementM {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, default: true })
  atStart: boolean;

  @Prop({ required: true, default: 0 })
  timeToShow: number;

  @Prop({ required: true, default: RowElementEnum.SLIDER, enum: RowElementEnum })
  type: RowElementEnum;

  @Prop({ required: true, type: StyleElementSchema })
  style: StyleElementM;

  @Prop({ required: true, type: [ConditionElementEntitySchema], default: [] })
  conditions: ConditionElementEntityM;

  @Prop({ required: true, type: SliderAnswerPropertySchema, default: getDefaultAnswers() })
  answers: SliderAnswerProperty;
}

const SliderElementSchema = SchemaFactory.createForClass(SliderElementM);
