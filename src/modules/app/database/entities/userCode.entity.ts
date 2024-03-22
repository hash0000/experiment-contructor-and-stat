import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserEntity } from './user.entity';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

export enum UserCodeTypeEnum {
  RECOVER,
  VERIFICATION,
}

@Schema({ collection: 'user_language', toObject: { versionKey: false }, toJSON: { versionKey: false } })
export class UserCode {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true, enum: UserCodeTypeEnum })
  type: UserCodeTypeEnum;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: entityNameConstant.USER }] })
  users: UserEntity[];

  @Prop({ expires: 86400 })
  createdAt: Date;
}

export type UserCodeDocument = mongoose.HydratedDocument<UserCode>;
export const UserCodeSchema = SchemaFactory.createForClass(UserCode);
