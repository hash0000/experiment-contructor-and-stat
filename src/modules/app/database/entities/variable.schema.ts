import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VariableDocument = HydratedDocument<Variable>;

@Schema({ _id: false, toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class VariableValue {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: [] })
  content: string[];
}

const VariableValueSchema = SchemaFactory.createForClass(VariableValue);

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class VariableColumn {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: [] })
  content: string[];
}

const VariableColumnSchema = SchemaFactory.createForClass(VariableColumn);

@Schema({ collection: 'variable', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class Variable {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: VariableValueSchema,
  })
  value: VariableValue;

  @Prop({
    required: true,
    type: [VariableColumnSchema],
  })
  columns: VariableColumn[];

  @Prop({ required: true })
  experimentId: string;
}

export const VariableSchema = SchemaFactory.createForClass(Variable);
