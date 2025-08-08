// src/interviews/interviews.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { User } from '../users/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Question } from 'src/questions/entities/question.entity';
import { Job } from 'src/data/entities/job.entity';
import { InterviewController } from './interviews.controller';
import { InterviewService } from './interviews.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, User, Question, Job]),
    EventEmitterModule.forRoot(),

  ],
  providers: [InterviewService],
  controllers: [InterviewController],

})
export class InterviewsModule {}