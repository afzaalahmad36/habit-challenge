import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './schema/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  findById(id: string) {
    return this.userRepo.findById(id);
  }

  findByEmail(email: string) {
    const filter: Partial<User> = { email };
    return this.userRepo.findOne(filter).select('+password');
  }

  findActiveUsers(options?: { limit?: number; skip?: number }) {
    return this.userRepo.findMany({ isActive: true }, options);
  }

  createUser(data: { email: string; password: string }) {
    return this.userRepo.create(data);
  }

  disableUser(userId: string) {
    return this.userRepo.updateById(userId, { isActive: false });
  }

  existsById(userId: string) {
    return this.userRepo.exists({ _id: userId });
  }

  incrementPoints(userId: Types.ObjectId, points: number) {
    return this.userRepo.incrementPoints(userId, points);
  }
}
