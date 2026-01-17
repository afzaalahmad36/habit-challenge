import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './schema/challenge.schema';
import { ChallengeRepository } from './schema/challenge.repository';
import { ChallengesService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { UserModule } from '../users/users.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    UserModule,
    forwardRef(() => TaskModule),
  ],
  controllers: [ChallengeController],
  providers: [ChallengesService, ChallengeRepository],
  exports: [ChallengesService],
})
export class ChallengeModule {}
