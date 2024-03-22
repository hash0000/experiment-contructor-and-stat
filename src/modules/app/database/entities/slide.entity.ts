import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ExperimentEntityM } from './experiment.entity';
import { transitionTypeEnum } from './postgres/slide.entity';
import { RowEntityM } from './row.entity';
import { SlideChildDocument, SlideChildEntityM } from './slideChild.entity';
import { Variable } from './variable.schema';

@Schema({ collection: 'slide', toObject: { versionKey: false }, toJSON: { versionKey: false, virtuals: true }, timestamps: true })
export class SlideEntityM {
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
    default: transitionTypeEnum.SUCCESSIVELY,
    enum: transitionTypeEnum,
  })
  transitionType: transitionTypeEnum;

  @Prop({ required: true, default: false })
  isCycle: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: Variable.name })
  variable: Variable;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'experiment' })
  experiment: ExperimentEntityM;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'row' }],
  })
  rows: RowEntityM[];

  childs: SlideChildDocument[];
}

export type SlideDocument = HydratedDocument<SlideEntityM>;
export const SlideSchema = SchemaFactory.createForClass(SlideEntityM);

SlideSchema.virtual('childs', {
  ref: SlideChildEntityM.name,
  localField: '_id',
  foreignField: 'slide',
});
