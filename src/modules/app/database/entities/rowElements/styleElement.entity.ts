import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class StyleElementM {
  @Prop({ required: true })
  mainColor: string;

  @Prop({ required: true })
  secondColor: string;

  @Prop({ required: true })
  thirdColor: string;

  @Prop({ required: true })
  fontSize: number;

  @Prop({ required: true })
  position: number;
}

export const StyleElementSchema = SchemaFactory.createForClass(StyleElementM);
