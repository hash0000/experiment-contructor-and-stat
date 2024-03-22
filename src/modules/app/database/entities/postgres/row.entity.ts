import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ButtonElement } from '../elements/buttonElement';
import { SliderElement } from '../elements/sliderElement';
import { TextFieldElement } from '../elements/textFieldElement';
import { CycleChildEntityP, SlideEntityP } from './slide.entity';

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
}

@Entity({ name: 'Row' })
export class RowEntityP {
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
  elements: Array<TextFieldElement | SliderElement | ButtonElement>;

  @ManyToOne(() => SlideEntityP, (Slide) => Slide.rows, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  slide: SlideEntityP;

  @ManyToOne(() => CycleChildEntityP, (slideChild) => slideChild.rows, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  slideChild: CycleChildEntityP;
}
