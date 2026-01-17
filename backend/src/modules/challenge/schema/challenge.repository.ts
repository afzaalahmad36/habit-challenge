import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Injectable()
export class ChallengeRepository {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
  ) {}

  async create(dto: CreateChallengeDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + dto.duration - 1);

    const challenge = new this.challengeModel({
      duration: dto.duration,
      startDate,
      endDate,
      habits: dto.habits,
      mode: dto.mode,
    });

    return challenge.save();
  }

  async findById(challengeId: string) {
    return this.challengeModel.findById(challengeId).lean();
  }

  async findByUser(userId: string) {
    return this.challengeModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async exists(challengeId: string): Promise<boolean> {
    return !!(await this.challengeModel.exists({
      _id: new Types.ObjectId(challengeId),
    }));
  }

  async delete(challengeId: string, userId: string) {
    return this.challengeModel.deleteOne({
      _id: challengeId,
      userId,
    });
  }
}
