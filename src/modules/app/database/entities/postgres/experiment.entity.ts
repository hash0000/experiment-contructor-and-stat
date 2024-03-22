import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SlideEntity } from './slide.entity';
import { UserEntity } from './user.entity';
export enum ExperimentOrderOptionEnum {
  DESC = 'DESC',
  ASC = 'ASC',
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

export class ExperimentSaveSettings {
  @ApiProperty({ type: Boolean })
  timeOnEachSlide = false;

  @ApiProperty({ type: Boolean })
  totalTime = false;

  @ApiProperty({ type: Boolean })
  startTime = false;

  @ApiProperty({ type: Boolean })
  endTime = false;
}

export enum answerTypeEnum {
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  TEXT,
  SELECTION_FROM_LIST,
}

type RequestedQuestionsType = {
  id: string;
  question: string;
  isRequired: boolean;
  answerType: answerTypeEnum;
  answers: string[];
};

export type RequestedParametersRespondentDataType = {
  id: string;
  title: string;
  variableId: string;
  attributeId: string;
};

/* accessConditions */
export enum accessConditionsOperatorEnum {
  EQUALS,
  NOT_EQUALS,
  MORE,
  LESS,
  MORE_OR_EQUALS,
  LESS_OR_EQUALS,
}

export enum accessConditionsConditionEnum {
  AGE,
  SEX,
  NATIVE_LANGUAGE,
  LEARNED_LANGUAGE,
}

type AccessConditionsType = {
  id: string;
  value: string;
  condition: accessConditionsConditionEnum;
  operator: accessConditionsOperatorEnum;
};

export class TransitionShortcutSettings {
  keyboard: boolean = false;
  mouse: boolean = false;
  keyShortcut: string = 'space';
}

/* end accessConditions */

export class ExperimentSettingsBasicRespondentData {
  @ApiProperty({ type: Boolean })
  firstName = false;

  @ApiProperty({ type: Boolean })
  lastName = false;

  @ApiProperty({ type: Boolean })
  birthday = false;

  @ApiProperty({ type: Boolean })
  sex = false;

  @ApiProperty({ type: Boolean })
  email = false;

  @ApiProperty({ type: Boolean })
  phone = false;

  @ApiProperty({ type: Boolean })
  nativeLanguages = false;

  @ApiProperty({ type: Boolean })
  learnedLanguages = false;
}

@Entity({ name: 'Experiment' })
export class ExperimentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 256,
  })
  title: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  description: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: new ExperimentSaveSettings(),
  })
  saveSettings: ExperimentSaveSettings;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: new ExperimentSettingsBasicRespondentData(),
  })
  requestedBasicRespondentData: ExperimentSettingsBasicRespondentData;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: () => '\'[]\'',
  })
  requestedParametersRespondentData: RequestedParametersRespondentDataType[];

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: [],
  })
  requestedQuestions: RequestedQuestionsType[];

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: [],
  })
  accessConditions: AccessConditionsType[];

  @Column({
    nullable: true,
    length: 255,
  })
  creators: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: new TransitionShortcutSettings(),
  })
  transitionShortcutSettings: TransitionShortcutSettings;

  @Column({
    nullable: false,
    length: 255,
    default: ExperimentStatusEnum.UNPUBLISHED,
  })
  status: ExperimentStatusEnum;

  @Column({
    nullable: false,
    default: 0,
  })
  usersStarted: number;

  @Column({
    nullable: false,
    default: 0,
  })
  usersEnded: number;

  @Column({
    nullable: false,
  })
  platform: ExperimentPlatformEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (User) => User.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  user: UserEntity;

  @OneToMany(() => SlideEntity, (slide) => slide.experiment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  slides: SlideEntity[];
}
