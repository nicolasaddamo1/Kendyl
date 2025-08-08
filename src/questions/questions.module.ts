// // src/questions/questions.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { QuestionsController } from './questions.controller';
// import { QuestionsService } from './questions.service';
// import { Interview } from '../interviews/entities/interview.entity';
// import { AuthModule } from '../auth/auth.module';
// import { ResponsesModule } from '../responses/responses.module';
// import { Question } from './entities/question.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Question, Interview]),
//     AuthModule,
//     ResponsesModule,
//   ],
//   controllers: [QuestionsController],
//   providers: [QuestionsService],
//   exports: [QuestionsService],
// })
// export class QuestionsModule {}