import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TaskService } from '../task/task.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengeRepository } from './schema/challenge.repository';
import { Types } from 'mongoose';
import { ChallengeMode } from './enums/challenge-mode.enum';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly challengeRepo: ChallengeRepository,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {}

  createChallenge(dto: CreateChallengeDto) {
    return this.challengeRepo.create(dto);
  }

  findAll() {
    return this.challengeRepo.findMany({});
  }

  async generateDailyTasks(today: Date): Promise<void> {
    const challenges = await this.challengeRepo.findActiveChallenges(today);

    for (const challenge of challenges) {
      await this.taskService.generateTasksForChallenge(
        {
          _id: challenge._id,
          habits: challenge.habits,
        },
        today,
        challenge.participantIds,
      );
    }
  }

  getChallenge(id: Types.ObjectId) {
    return this.challengeRepo.findById(id);
  }

  async joinChallenge(challengeId: Types.ObjectId, userId: Types.ObjectId) {
    const challenge = await this.challengeRepo.findById(challengeId);
    if (!challenge) throw new BadRequestException('Challenge not found');

    const userObjectId = new Types.ObjectId(userId);

    if (challenge.participantIds.some((id) => id.equals(userObjectId))) {
      throw new BadRequestException('User already joined');
    }

    // mode validation (unchanged)
    const participantCount = challenge.participantIds.length;

    switch (challenge.mode) {
      case ChallengeMode.SOLO:
        if (participantCount >= 1)
          throw new BadRequestException(
            'Solo challenge already has a participant',
          );
        break;
      case ChallengeMode.ONE_ON_ONE:
        if (participantCount >= 2)
          throw new BadRequestException('One-on-One challenge is full');
        break;
    }

    challenge.participantIds.push(userObjectId);
    await challenge.save();

    // ✅ Generate tasks ONLY if challenge has started
    if (new Date() >= challenge.startDate) {
      await this.taskService.generateTasksForChallenge(challenge, new Date(), [
        userId,
      ]);
    }

    return { message: 'Joined challenge successfully' };
  }
}
