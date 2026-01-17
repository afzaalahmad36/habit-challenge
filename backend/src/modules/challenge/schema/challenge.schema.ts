import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChallengeMode } from '../enums/challenge-mode.enum';

export type ChallengeDocument = Challenge & Document;

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
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
