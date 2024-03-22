import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SlideDocument } from './slide.entity';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

enum RowHeightEnum {
  ELEMENT,
  SLIDE,
}

enum RowMaxColumnEnum {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

enum SlideFkTypeEnum {
  SLIDE,
  DESCENDANT,
}

@Schema({ collection: 'row', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class RowEntity {
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

  @Prop({
    required: true,
    enum: SlideFkTypeEnum,
  })
  slideType: SlideFkTypeEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.SLIDE })
  slide: SlideDocument;
}

export const RowEntitySchema = SchemaFactory.createForClass(RowEntity);
export type RowEntityDocument = HydratedDocument<RowEntity>;
