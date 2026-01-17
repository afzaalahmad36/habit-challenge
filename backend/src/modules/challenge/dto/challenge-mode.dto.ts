import { IsEnum } from 'class-validator';
import { ChallengeMode } from '../enums/challenge-mode.enum';

export class ChallengeModeDto {
  @IsEnum(ChallengeMode)
  mode: ChallengeMode;
}
