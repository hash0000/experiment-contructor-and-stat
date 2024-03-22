import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ButtonElement } from '../buttonElement';
import { SliderElement } from '../sliderElement';
import { TextFieldElement } from '../textFieldElement';
import { CycleChildEntity, SlideEntity } from './slide.entity';
import { TextInputElement } from '../textInputElement';

export enum RowHeightEnum {
  ELEMENT = 'element',
  SLIDE = 'slide',
}

export enum RowMaxColumnEnum {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export enum RowElementEnum {
  TEXT = 'text',
  SLIDER = 'slider',
  BUTTON = 'button',
  INPUT = 'input',
}

@Entity({ name: 'Row' })
export class RowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: RowHeightEnum.ELEMENT,
  })
  height: RowHeightEnum;

  @Column({
    nullable: false,
    default: 1,
  })
  maxColumn: RowMaxColumnEnum;

  @Column({
    nullable: false,
    default: 1,
  })
  position: number;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    default: () => "'[]'",
  })
  elements: Array<TextFieldElement | SliderElement | ButtonElement | TextInputElement>;

  @ManyToOne(() => SlideEntity, (Slide) => Slide.rows, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  slide: SlideEntity;

  @ManyToOne(() => CycleChildEntity, (slideChild) => slideChild.rows, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  slideChild: CycleChildEntity;
}
