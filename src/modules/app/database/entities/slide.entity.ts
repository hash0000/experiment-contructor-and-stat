import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ExperimentDocument } from './experiment.entity';
import { transitionTypeEnum } from './postgres/slide.entity';
import { SlideDescendantDocument, SlideDescendantSchema } from './slideDescendant.entity';
import { Variable } from './variable.schema';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

@Schema({
  collection: 'slide',
  toObject: { versionKey: false },
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (_, model) => {
      delete model.id;
    },
  },
  timestamps: true,
})
export class SlideEntity {
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

  @Prop({
    required: true,
    default: [],
    type: [SlideDescendantSchema],
  })
  descendants: SlideDescendantDocument[];

  @Prop({ type: mongoose.Types.ObjectId, ref: entityNameConstant.VARIABLE })
  variable: Variable;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.EXPERIMENT })
  experiment: ExperimentDocument;
}

export type SlideDocument = HydratedDocument<SlideEntity>;
export const SlideSchema = SchemaFactory.createForClass(SlideEntity);

SlideSchema.virtual('childs', {
  ref: entityNameConstant.SLIDE,
  localField: '_id',
  foreignField: 'slide',
});
