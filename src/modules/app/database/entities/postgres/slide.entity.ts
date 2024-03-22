import { Column, Entity, FindOptionsSelect, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { RowEntity } from './row.entity';

export const cycleChildEntityBaseSelectOptions: FindOptionsSelect<SlideEntity> = {
  id: true,
  title: true,
  training: true,
  autoTransition: true,
  timeForTransition: true,
  colorCode: true,
  position: true,
};

export const slideEntityBaseSelectOptions: FindOptionsSelect<SlideEntity> = {
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
export class SlideEntity extends BaseSlideEntity {
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

  @OneToMany(() => RowEntity, (row) => row.slide, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rows: RowEntity[];

  @OneToMany(() => CycleChildEntity, (children) => children.cycle, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  children: CycleChildEntity[];

  @ManyToOne(() => ExperimentEntity, (experiment) => experiment.slides, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  experiment: ExperimentEntity;
}

@Entity({ name: 'CycleChild' })
@Unique(['cycle', 'position'], { deferrable: 'INITIALLY DEFERRED' })
export class CycleChildEntity extends BaseSlideEntity {
  @OneToMany(() => RowEntity, (row) => row.slideChild, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rows: RowEntity[];

  @ManyToOne(() => ExperimentEntity, (experiment) => experiment.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  experiment: ExperimentEntity;

  @ManyToOne(() => SlideEntity, (cycle) => cycle.children, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cycle: SlideEntity;
}
