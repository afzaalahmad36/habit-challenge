import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  points: number;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
