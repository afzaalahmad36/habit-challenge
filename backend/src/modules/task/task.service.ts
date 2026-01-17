import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TaskRepository } from './schema/task.repository';
import { UserService } from '../users/users.service';
import { startOfDay } from 'date-fns';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userService: UserService,
  ) {}

  async generateTasksForChallenge(
    challenge: { _id: Types.ObjectId; habits: { habitId: string }[] },
    date: Date,
    participantIds: Types.ObjectId[],
  ): Promise<void> {
    const normalizedDate = startOfDay(date);

    const tasksToInsert = participantIds.flatMap((userId) =>
      challenge.habits.map((habit) => ({
        challengeId: challenge._id,
        userId,
        habitId: habit.habitId,
        date: normalizedDate,
        points: 1,
        isCompleted: false,
      })),
    );

    // Bulk insert, ignore duplicates
    await this.taskRepository.createMany(tasksToInsert).catch((err) => {
      if (err.code !== 11000) throw err; // ignore duplicate key errors
    });
  }

  async getDailyTasks(userId: Types.ObjectId, date: Date) {
    return this.taskRepository.findByUserAndDate(userId, date);
  }

  async completeTask(taskId: Types.ObjectId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new BadRequestException('Task not found');
    if (task.isCompleted)
      throw new BadRequestException('Task already completed');

    const updatedTask = await this.taskRepository.markComplete(taskId);

    await this.userService.incrementPoints(
      updatedTask.userId,
      updatedTask.points,
    );

    return updatedTask;
  }

  async isDailyCompletionDone(
    userId: Types.ObjectId,
    date: Date,
  ): Promise<boolean> {
    const tasks = await this.taskRepository.findByUserAndDate(userId, date);
    return tasks.length > 0 && tasks.every((t) => t.isCompleted);
  }
}
