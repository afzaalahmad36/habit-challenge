import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChallengeMode } from '../enums/challenge-mode.enum';
import { User } from 'src/modules/users/schema/user.schema';
import { addDays } from 'date-fns';

export type ChallengeDocument = HydratedDocument<Challenge> & { endDate: Date };

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ required: true, min: 1 })
  duration: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({
    type: String,
    enum: ChallengeMode,
    required: true,
  })
  mode: ChallengeMode;

  @Prop({
    type: [
      {
        habitId: { type: String, required: true },
        requirement: {
          type: {
            type: String,
            required: true,
          },
          value: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      },
    ],
    required: true,
  })
  habits: {
    habitId: string;
    requirement: {
      type: string;
      value: number;
    };
  }[];

  @Prop({ type: [Types.ObjectId], ref: User.name })
  participantIds: Types.ObjectId[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

ChallengeSchema.set('toJSON', { virtuals: true });
ChallengeSchema.set('toObject', { virtuals: true });

ChallengeSchema.virtual('endDate').get(function () {
  return addDays(this.startDate, this.duration);
});
