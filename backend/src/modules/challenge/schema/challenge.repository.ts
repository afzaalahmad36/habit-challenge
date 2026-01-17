import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { QueryFilter } from 'mongoose';

@Injectable()
export class ChallengeRepository {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
  ) {}

  async create(dto: CreateChallengeDto) {
    const startDate = new Date(dto.startDate);
    const challenge = new this.challengeModel({
      duration: dto.duration,
      startDate,
      habits: dto.habits,
      mode: dto.mode,
    });

    return challenge.save();
  }

  async findById(challengeId: Types.ObjectId) {
    return this.challengeModel.findById(challengeId);
  }

  async findByUser(userId: string) {
    return this.challengeModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async exists(challengeId: string): Promise<boolean> {
    return !!(await this.challengeModel.exists({
      _id: new Types.ObjectId(challengeId),
    }));
  }

  findMany(
    filter: QueryFilter<ChallengeDocument>,
    options?: QueryOptions<ChallengeDocument>,
  ): Promise<ChallengeDocument[]> {
    return this.challengeModel.find(filter, null, options);
  }

  async delete(challengeId: string, userId: string) {
    return this.challengeModel.deleteOne({
      _id: challengeId,
      userId,
    });
  }

  async findActiveChallenges(today: Date) {
    return this.findMany({
      startDate: { $lte: today },
    }).then((challenges) => challenges.filter((ch) => today <= ch.endDate));
  }
}
