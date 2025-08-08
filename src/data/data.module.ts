// src/data/data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Interview } from '../interviews/entities/interview.entity';
import { User } from '../users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Resume } from './entities/resume.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Job } from './entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Response, Interview, User, Feedback, Question, Resume, Job]),
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}