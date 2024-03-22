import { Column, Entity, FindOptionsSelect, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ExperimentEntityP } from './experiment.entity';
import { RowEntityP } from './row.entity';

export const cycleChildEntityBaseSelectOptions: FindOptionsSelect<SlideEntityP> = {
  id: true,
  title: true,
  training: true,
  autoTransition: true,
  timeForTransition: true,
  colorCode: true,
  position: true,
};

export const slideEntityBaseSelectOptions: FindOptionsSelect<SlideEntityP> = {
  ...cycleChildEntityBaseSelectOptions,
  transitionType: true,
  variableId: true,
  isCycle: true,
};

export enum transitionTypeEnum {
  SUCCESSIVELY,
  RANDOM,
}

export class BaseSlideEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 255,
  })
  title: string;

  @Column({
    nullable: false,
    default: false,
  })
  training: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  autoTransition: boolean;

  @Column({
    nullable: true,
  })
  timeForTransition: number;

  @Column({
    nullable: false,
    default: '#ffffff',
  })
  colorCode: string;

  @Column({
    nullable: false,
    default: 1,
  })
  position: number;
}

@Entity({ name: 'Slide' })
@Unique(['experiment', 'position'], { deferrable: 'INITIALLY DEFERRED' })
export class SlideEntityP extends BaseSlideEntity {
  @Column({
    default: transitionTypeEnum.SUCCESSIVELY,
  })
  transitionType: transitionTypeEnum;

  @Column({
    nullable: false,
    default: false,
  })
  isCycle: boolean;

  @Column({
    nullable: true,
  })
  variableId: string;

  @OneToMany(() => RowEntityP, (row) => row.slide, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rows: RowEntityP[];

  @OneToMany(() => CycleChildEntityP, (children) => children.cycle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  children: CycleChildEntityP[];

  @ManyToOne(() => ExperimentEntityP, (experiment) => experiment.slides, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  experiment: ExperimentEntityP;
}

@Entity({ name: 'CycleChild' })
@Unique(['cycle', 'position'], { deferrable: 'INITIALLY DEFERRED' })
export class CycleChildEntityP extends BaseSlideEntity {
  @OneToMany(() => RowEntityP, (row) => row.slideChild, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rows: RowEntityP[];

  @ManyToOne(() => ExperimentEntityP, (experiment) => experiment.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  experiment: ExperimentEntityP;

  @ManyToOne(() => SlideEntityP, (cycle) => cycle.children, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cycle: SlideEntityP;
}
