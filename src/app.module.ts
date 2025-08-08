import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { RtcModule } from './rtc/rtc.module';
import { AiModule } from './ai/ai.module';
import { DataModule } from './data/data.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Feedback } from './data/entities/feedback.entity';
import { Resume } from './data/entities/resume.entity';
import { Interview } from './interviews/entities/interview.entity';
import { EvaluationRubric } from './interviews/entities/evaluation_rubrics.entity';
import { Response } from './interviews/entities/responses.entity';
import { Question } from './questions/entities/question.entity';
import { Job } from './data/entities/job.entity';
import { JobUser } from './data/entities/job-user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Feedback, Resume, Question, Interview, Response, EvaluationRubric, Job, JobUser ], // Añade todas tus entidades aquí
      synchronize: true, // Solo para desarrollo
    }),
    InterviewsModule,
    UsersModule,
    AuthModule,
    DataModule,
    RtcModule,
    AiModule,
    AiModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
