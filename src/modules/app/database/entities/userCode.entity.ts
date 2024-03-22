import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserEntityM } from './user.entity';

enum UserCodeTypeEnum {
  RECOVER,
  VERIFICATION,
}

@Schema({ collection: 'user_language', toObject: { versionKey: false }, toJSON: { versionKey: false } })
class UserCodeM {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true, enum: UserCodeTypeEnum })
  type: UserCodeTypeEnum;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserEntityM' }] })
  users: UserEntityM[];

  @Prop({ expires: 86400 })
  createdAt: Date;
}

type UserCodeDocument = mongoose.HydratedDocument<UserCodeM>;
const UserCodeSchema = SchemaFactory.createForClass(UserCodeM);
