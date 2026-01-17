import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HabitId } from '../enums/habit-id.enum';
import { RequirementDto } from './requirement.dto';

export class ChallengeHabitDto {
  @IsEnum(HabitId)
  habitId: HabitId;

  @ValidateNested()
  @Type(() => RequirementDto)
  requirement: RequirementDto;
}
