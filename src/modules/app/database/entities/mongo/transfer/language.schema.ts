import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type LanguageDocument = HydratedDocument<LanguageM>;

@Schema({ collection: 'language', toObject: { versionKey: false }, toJSON: { versionKey: false } })
class LanguageM {
  @Prop({ required: true })
  code: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  native: string;

  @Prop({ required: false })
  region: string;
}

const LanguageSchema = SchemaFactory.createForClass(LanguageM);
