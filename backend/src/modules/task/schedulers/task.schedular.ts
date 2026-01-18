import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ChallengesService } from '../../challenge/challenge.service';
import { format } from 'date-fns';

@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);
  constructor(private readonly challengeService: ChallengesService) {}

  @Cron('0 0 * * *') // every day at midnight
  // @Cron('*/30 * * * * *')
  async handleCron() {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd HH:mm:ss');
    this.logger.log(
      `Cron job started: Generating daily tasks for ${formattedDate}`,
    );
    try {
      await this.challengeService.generateDailyTasks(today);
      this.logger.log(`Cron job finished successfully for ${formattedDate}`);
    } catch (error) {
      this.logger.error(
        `Error generating daily tasks for ${formattedDate}`,
        error.stack,
      );
    }
  }
}
