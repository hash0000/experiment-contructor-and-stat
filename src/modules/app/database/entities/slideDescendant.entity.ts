import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RowEntity } from './row.entity';
import { SlideEntity } from './slide.entity';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false }, timestamps: true })
export class SlideDescendantEntity {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    default: false,
  })
  training: boolean;

  @Prop({ required: true, default: true })
  autoTransition: boolean;

  @Prop()
  timeForTransition: number;

  @Prop({
    required: true,
    default: '#ffffff',
  })
  colorCode: string;

  @Prop({ required: true })
  position: number;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.ROW }],
  // })
  // rows: RowEntity[];
}

export type SlideDescendantDocument = HydratedDocument<SlideDescendantEntity>;
export const SlideDescendantSchema = SchemaFactory.createForClass(SlideDescendantEntity);
