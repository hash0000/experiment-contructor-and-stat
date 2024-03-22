import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'language', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class LanguageEntity {
  @Prop({ required: true })
  code: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  native: string;

  @Prop({ required: false })
  region: string;
}

export type LanguageDocument = HydratedDocument<LanguageEntity>;
export const LanguageSchema = SchemaFactory.createForClass(LanguageEntity);
