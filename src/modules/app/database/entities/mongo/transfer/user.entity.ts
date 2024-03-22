import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type UserDocument = HydratedDocument<UserEntityM>;

@Schema({ collection: 'user', toObject: { versionKey: false }, toJSON: { versionKey: false } })
class UserEntityM {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

const UserSchema = SchemaFactory.createForClass(UserEntityM);
