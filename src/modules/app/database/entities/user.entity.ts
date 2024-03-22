import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as argon from 'argon2';
import { LanguageEntity } from './language.entity';
import { entityNameConstant } from '../../../../common/constants/entityName.constant';

export enum UserSexEnum {
  NOT_KNOWN,
  MALE,
  FEMALE,
}

enum UserLanguageProficiencyEnum {
  ELEMENTARY = 'A1',
  PRE_INTERMEDIATE = 'A2',
  INTERMEDIATE = 'B1',
  UPPER_INTERMEDIATE = 'B2',
  ADVANCED = 'C1',
  PROFICIENT = 'C2',
  NATIVE = 'N',
}

@Schema({ toObject: { versionKey: false }, toJSON: { versionKey: false } })
class UserLanguageProperty {
  @Prop({ required: true, default: UserLanguageProficiencyEnum.ELEMENTARY, enum: UserLanguageProficiencyEnum })
  proficiency: UserLanguageProficiencyEnum;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: entityNameConstant.LANGUAGE })
  language: LanguageEntity;
}

const UserLanguagePropertySchema = SchemaFactory.createForClass(UserLanguageProperty);

@Schema({
  collection: 'user',
  toObject: { versionKey: false },
  toJSON: {
    versionKey: false,
  },
  timestamps: true,
})
export class UserEntity {
  @Prop({ required: true })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({ required: false, default: null })
  middleName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  phoneCountryCode: string;

  @Prop({
    required: false,
    default: null,
    index: {
      unique: true,
      partialFilterExpression: { phone: { $type: 'string' } },
    },
  })
  phone: string;

  @Prop({ required: false, default: null })
  birthday: Date;

  @Prop({ required: false, default: null })
  laboratory: string;

  @Prop({ required: false, default: null })
  specialization: string;

  @Prop({
    required: true,
    default: UserSexEnum.NOT_KNOWN,
    enum: UserSexEnum,
  })
  sex: UserSexEnum;

  @Prop({ required: false, default: null })
  avatarUrl: string;

  @Prop({
    required: true,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    required: true,
    type: [UserLanguagePropertySchema],
    default: [],
  })
  languages: UserLanguageProperty[];
}

export type UserDocument = HydratedDocument<UserEntity>;
export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.pre('save', async function (next): Promise<void> {
  if (this.isModified('password')) {
    this.password = await argon.hash(this.password, {
      type: 2,
      salt: Buffer.from(process.env.SALT, 'utf-8'),
    });
  }
  next();
});
