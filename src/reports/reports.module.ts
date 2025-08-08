// // src/reports/reports.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ReportsController } from './reports.controller';
// // import { ReportsService } from './reports.service';
// import { Interview } from '../interviews/entities/interview.entity';
// import { User } from '../users/entities/user.entity';
// import { Question } from '../questions/entities/question.entity';
// import { Response } from '../responses/entities/response.entity';
// import { InterviewsModule } from '../interviews/interviews.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Interview, User, Question, Response]),
//     InterviewsModule,
//   ],
//   controllers: [ReportsController],
//   providers: [ReportsService],
//   exports: [ReportsService],
// })
// export class ReportsModule {}