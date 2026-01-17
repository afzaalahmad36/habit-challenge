import { Injectable } from '@nestjs/common';
import { ChallengeRepository } from './schema/challenge.repository';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly challengeRepo: ChallengeRepository) {}

  createChallenge(dto: CreateChallengeDto) {
    return this.challengeRepo.create(dto);
  }

  getChallenge(id: string) {
    return this.challengeRepo.findById(id);
  }
}
