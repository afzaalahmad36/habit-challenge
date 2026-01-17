import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model, Types } from 'mongoose';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly model: Model<TaskDocument>,
  ) {}

  createMany(tasks: Partial<Task>[]) {
    return this.model.insertMany(tasks, { ordered: false });
  }

  findByUserAndDate(userId: Types.ObjectId, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return this.model.find({
      userId,
      date: { $gte: start, $lte: end },
    });
  }

  findById(id: Types.ObjectId) {
    return this.model.findById(id).lean();
  }

  markComplete(taskId: Types.ObjectId) {
    return this.model.findByIdAndUpdate(
      taskId,
      { isCompleted: true, completedAt: new Date() },
      { new: true },
    );
  }
}
