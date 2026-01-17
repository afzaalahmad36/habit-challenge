import { IsMongoId, IsOptional, IsISO8601 } from 'class-validator';

export class GetDailyTasksDto {
  @IsMongoId()
  challengeId: string;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
