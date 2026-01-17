import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Challenge } from 'src/modules/challenge/schema/challenge.schema';
import { User } from 'src/modules/users/schema/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: Types.ObjectId, ref: Challenge.name })
  challengeId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  habitId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  points: number;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  completedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index(
  { challengeId: 1, userId: 1, habitId: 1, date: 1 },
  { unique: true },
);
