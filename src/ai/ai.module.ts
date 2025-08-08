// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../interviews/entities/interview.entity';

import { OpenAIService } from './providers/openai.service';
import { HeygenService } from './providers/heygen.service';
import { EvaluationRubric } from 'src/interviews/entities/evaluation_rubrics.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview, 
      Question, 
      Response,
      EvaluationRubric,
    ]),
    ConfigModule,
  ],
  controllers: [AiController],
  providers: [AiService, OpenAIService, HeygenService],
  exports: [AiService],
})
export class AiModule {}