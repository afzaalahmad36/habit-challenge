import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { TaskRepository } from './schema/task.repository';
import { TaskService } from './task.service';
import { UserModule } from '../users/users.module';
import { TaskController } from './task.controller';
import { TasksScheduler } from './schedulers/task.schedular';
import { ChallengeModule } from '../challenge/challenge.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UserModule,
    forwardRef(() => ChallengeModule),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TasksScheduler],
  exports: [TaskService],
})
export class TaskModule {}
