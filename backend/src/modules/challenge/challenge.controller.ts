import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengesService } from './challenge.service';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.challengeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createChallenge(@Body() dto: CreateChallengeDto) {
    return this.challengeService.createChallenge(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':challengeId/join')
  async joinChallenge(@Param() dto: JoinChallengeDto, @Req() req) {
    const userId = req.user._id;
    return this.challengeService.joinChallenge(
      new Types.ObjectId(dto.challengeId),
      userId,
    );
  }
}
