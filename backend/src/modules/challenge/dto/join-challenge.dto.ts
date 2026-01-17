import { IsMongoId } from 'class-validator';

export class JoinChallengeDto {
  @IsMongoId()
  challengeId: string;
}
