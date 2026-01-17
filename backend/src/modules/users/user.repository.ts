import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  findOne(filter: Partial<User>) {
    return this.userModel.findOne(filter).lean();
  }

  findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  findMany(
    filter: Partial<User>,
    options?: { limit?: number; skip?: number; sort?: any },
  ) {
    return this.userModel
      .find(filter)
      .limit(options?.limit ?? 10)
      .skip(options?.skip ?? 0)
      .sort(options?.sort ?? { createdAt: -1 })
      .lean();
  }

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  updateById(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  exists(filter: Partial<User> & { _id?: string }) {
    return this.userModel.exists(filter);
  }
}
