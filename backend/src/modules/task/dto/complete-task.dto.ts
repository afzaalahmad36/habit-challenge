import { IsMongoId } from 'class-validator';

export class CompleteTaskDto {
  @IsMongoId()
  taskId: string;
}
