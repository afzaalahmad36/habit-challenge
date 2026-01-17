import {
  IsArray,
  IsDateString,
  IsInt,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChallengeHabitDto } from './challenge-habit.dto';
import { ChallengeMode } from '../enums/challenge-mode.enum';

export class CreateChallengeDto {
  @IsInt()
  @Min(1)
  duration: number;

  @IsDateString()
  startDate: string;

  @IsEnum(ChallengeMode)
  mode: ChallengeMode;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => ChallengeHabitDto)
  habits: ChallengeHabitDto[];
}
