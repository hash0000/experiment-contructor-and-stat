import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'language', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class LanguageEntityM {
  @Prop({ required: true })
  code: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  native: string;

  @Prop({ required: false })
  region: string;
}

export type LanguageDocument = HydratedDocument<LanguageEntityM>;
export const LanguageSchema = SchemaFactory.createForClass(LanguageEntityM);
