import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RowEntityM } from './row.entity';
import { SlideEntityM } from './slide.entity';

@Schema({ collection: 'slide_child', toObject: { versionKey: false }, toJSON: { versionKey: false }, timestamps: true })
export class SlideChildEntityM {
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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: RowEntityM.name }],
  })
  rows: RowEntityM[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'slide' })
  slide: SlideEntityM;
}

export type SlideChildDocument = HydratedDocument<SlideChildEntityM>;
export const SlideChildSchema = SchemaFactory.createForClass(SlideChildEntityM);
