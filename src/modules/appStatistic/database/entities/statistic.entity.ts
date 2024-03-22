import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RowElementEnum } from '../../../app/database/entities/postgres/row.entity';

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
class Respondent {
  @Prop({ default: null })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ default: null })
  middleName: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: [] })
  learnedLanguages: string[];

  @Prop({ default: [] })
  nativeLanguages: string[];

  @Prop({ default: [] })
  requestedParametersRespondentData: string[];

  @Prop({ default: [] })
  requestedQuestions: string[];

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null, type: 'date' })
  birthday: Date;

  @Prop({ default: null })
  sex: string;
}

const RespondentSchema = SchemaFactory.createForClass(Respondent);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false }, timestamps: { createdAt: true } })
class StatisticsData {
  @Prop({ required: true })
  elementId: string;

  @Prop({ required: true })
  elementTitle: string;

  @Prop({ required: true })
  elementType: RowElementEnum;

  @Prop({ required: true })
  jsTimestamp: number;

  // TODO: create enum for this field
  @Prop({ required: true })
  actionType: string;

  @Prop({ default: false })
  isAnswer: boolean;

  @Prop({ default: null })
  value: string;
}

const StatisticsDataSchema = SchemaFactory.createForClass(StatisticsData);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false }, timestamps: { createdAt: true } })
class Statistics {
  @Prop({ required: true })
  slideId: string;

  @Prop({ required: true })
  slideTitle: string;

  @Prop({ default: null })
  inSlideDuration: number;

  @Prop({ default: null })
  answers: string[];

  @Prop({ default: null })
  answerTime: number;

  @Prop({ required: true })
  constructorPosition: number;

  @Prop({ default: null })
  passingPosition: number;

  @Prop({ required: true })
  isTraining: boolean;

  @Prop({ required: true })
  isChild: boolean;

  @Prop({ default: null })
  jsStartTimestamp: number;

  @Prop({
    required: true,
    type: [StatisticsDataSchema],
    default: [],
  })
  data: StatisticsData[];
}

const StatisticsSchema = SchemaFactory.createForClass(Statistics);

export type StatisticDocument = HydratedDocument<Statistic>;

@Schema({ collection: 'statistic', toObject: { versionKey: false }, toJSON: { versionKey: false }, timestamps: { createdAt: true, updatedAt: false } })
export class Statistic {
  @Prop({ required: true })
  experimentId: string;

  @Prop({ default: [] })
  slidesIds: string[];

  @Prop({ required: true })
  experimentTitle: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true, default: false })
  finished: boolean;

  @Prop({ default: null })
  jsFinishTimestamp: number;

  @Prop({
    required: false,
    type: RespondentSchema,
  })
  respondent: Respondent;

  @Prop({
    required: true,
    type: [StatisticsSchema],
    default: [],
  })
  statistics: Statistics[];
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
