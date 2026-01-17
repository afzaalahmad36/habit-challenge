import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { GetDailyTasksDto } from './dto/get-daily-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get('daily-tasks')
  getDailyTasks(@Query() dto: GetDailyTasksDto, @Req() req) {
    const userId = req.user._id;
    const date = dto.date ? new Date(dto.date) : new Date();
    return this.taskService.getDailyTasks(new Types.ObjectId(userId), date);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':taskId/complete')
  completeTask(@Param() dto: CompleteTaskDto) {
    return this.taskService.completeTask(new Types.ObjectId(dto.taskId));
  }
}
