import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SlideDocument } from './slide.entity';
import { UserDocument } from './user.entity';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

export enum ExperimentSortOptionEnum {
  ALPHABETICAL = 'alphabetical',
  DATE_PUBLISHED = 'datePublished',
  POPULARITY = 'popularity',
}

export enum ExperimentStatusEnum {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  RESTRICTED = 'restricted',
}

export enum ExperimentPlatformEnum {
  WEB = 'web',
  MOBILE = 'mobile',
  CROSS_PLATFORM = 'crossPlatform',
}

enum answerTypeEnum {
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  TEXT,
  SELECTION_FROM_LIST,
}

export enum accessConditionsConditionEnum {
  AGE,
  SEX,
  NATIVE_LANGUAGE,
  LEARNED_LANGUAGE,
}

export enum accessConditionsOperatorEnum {
  EQUALS,
  NOT_EQUALS,
  MORE,
  LESS,
  MORE_OR_EQUALS,
  LESS_OR_EQUALS,
}

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
class SaveSettingsProperty {
  @Prop({ required: true, default: false })
  timeOnEachSlide: boolean;

  @Prop({ required: true, default: false })
  totalTime: boolean;

  @Prop({ required: true, default: false })
  startTime: boolean;

  @Prop({ required: true, default: false })
  endTime: boolean;
}

const SaveSettingsPropertySchema = SchemaFactory.createForClass(SaveSettingsProperty);

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
class RequestedBasicRespondentDataProperty {
  @Prop({ required: true, default: false })
  firstName: boolean;

  @Prop({ required: true, default: false })
  lastName: boolean;

  @Prop({ required: true, default: false })
  birthday: boolean;

  @Prop({ required: true, default: false })
  sex: boolean;

  @Prop({ required: true, default: false })
  email: boolean;

  @Prop({ required: true, default: false })
  phone: boolean;

  @Prop({ required: true, default: false })
  nativeLanguages: boolean;

  @Prop({ required: true, default: false })
  learnedLanguages: boolean;
}

const RequestedBasicRespondentDataPropertySchema = SchemaFactory.createForClass(RequestedBasicRespondentDataProperty);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class RequestedParametersRespondentDataProperty {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.VARIABLE })
  variable: string;

  @Prop({ required: true })
  attributeId: string;
}

export type RequestedParametersRespondentDataPropertyDocument = HydratedDocument<RequestedParametersRespondentDataProperty>;
const RequestedParametersRespondentDataPropertySchema = SchemaFactory.createForClass(RequestedParametersRespondentDataProperty);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class RequestedQuestionsProperty {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  isRequired: boolean;

  @Prop({ required: true, enum: answerTypeEnum })
  answerType: answerTypeEnum;

  @Prop({ required: true })
  answers: string[];
}

type RequestedQuestionsPropertyDocument = HydratedDocument<RequestedQuestionsProperty>;
const RequestedQuestionsPropertySchema = SchemaFactory.createForClass(RequestedQuestionsProperty);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class AccessConditionsProperty {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true, enum: accessConditionsConditionEnum })
  condition: accessConditionsConditionEnum;

  @Prop({ required: true, enum: accessConditionsOperatorEnum })
  operator: accessConditionsOperatorEnum;
}

export type AccessConditionsPropertyDocument = HydratedDocument<AccessConditionsProperty>;
const AccessConditionsPropertySchema = SchemaFactory.createForClass(AccessConditionsProperty);

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
class TransitionShortcutSettingsProperty {
  @Prop({ required: true, default: false })
  keyboard: boolean;

  @Prop({ required: true, default: false })
  mouse: boolean;

  @Prop({ default: 'space' })
  keyShortcut: string;
}

const TransitionShortcutSettingsPropertySchema = SchemaFactory.createForClass(TransitionShortcutSettingsProperty);

@Schema({
  collection: 'experiment',
  toObject: { versionKey: false },
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (_, model) => {
      delete model.id;
    },
  },
  timestamps: true,
})
export class ExperimentEntity {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({ required: false, default: null })
  description: string;

  @Prop({
    required: true,
    default: new SaveSettingsProperty(),
    type: SaveSettingsPropertySchema,
  })
  saveSettings: SaveSettingsProperty;

  @Prop({
    required: true,
    default: new RequestedBasicRespondentDataProperty(),
    type: RequestedBasicRespondentDataPropertySchema,
  })
  requestedBasicRespondentData: RequestedBasicRespondentDataProperty;

  @Prop({
    required: true,
    default: [],
    type: [RequestedParametersRespondentDataPropertySchema],
  })
  requestedParametersRespondentData: RequestedParametersRespondentDataPropertyDocument[];

  @Prop({
    required: true,
    default: [],
    type: [RequestedQuestionsPropertySchema],
  })
  requestedQuestions: RequestedQuestionsPropertyDocument[];

  @Prop({
    required: true,
    default: [],
    type: [AccessConditionsPropertySchema],
  })
  accessConditions: AccessConditionsPropertyDocument[];

  @Prop({ required: false, default: null })
  creators: string;

  @Prop({
    required: true,
    default: new TransitionShortcutSettingsProperty(),
    type: TransitionShortcutSettingsPropertySchema,
  })
  transitionShortcutSettings: TransitionShortcutSettingsProperty;

  @Prop({
    required: true,
    default: ExperimentStatusEnum.UNPUBLISHED,
    enum: ExperimentStatusEnum,
  })
  status: ExperimentStatusEnum;

  @Prop({
    required: true,
    default: 0,
  })
  usersStarted: number;

  @Prop({
    required: true,
    default: 0,
  })
  usersEnded: number;

  @Prop({
    required: true,
  })
  platform: ExperimentPlatformEnum;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.USER })
  user: UserDocument;

  slides: SlideDocument[];
}

export type ExperimentDocument = HydratedDocument<ExperimentEntity>;
export const ExperimentSchema = SchemaFactory.createForClass(ExperimentEntity);

ExperimentSchema.virtual('slides', {
  ref: entityNameConstant.SLIDE,
  localField: '_id',
  foreignField: 'experiment',
});
