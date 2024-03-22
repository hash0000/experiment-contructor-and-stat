import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SlideEntity } from './postgres/slide.entity';
import { SlideEntityM } from './slide.entity';

enum RowHeightEnum {
  ELEMENT,
  SLIDE,
}

enum RowMaxColumnEnum {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

@Schema({ collection: 'row', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class RowEntityM {
  @Prop({ required: true, default: RowHeightEnum.ELEMENT, enum: RowHeightEnum })
  height: RowHeightEnum;

  @Prop({
    required: true,
    default: RowMaxColumnEnum.ONE,
    enum: RowMaxColumnEnum,
  })
  maxColumn: RowMaxColumnEnum;

  @Prop({ required: true, default: 1 })
  position: number;

  @Prop({ required: true, default: [] })
  elements: object[];

  @Prop({ type: mongoose.Types.ObjectId, ref: SlideEntity.name })
  slide: SlideEntityM;
}

export const RowSchema = SchemaFactory.createForClass(RowEntityM);
