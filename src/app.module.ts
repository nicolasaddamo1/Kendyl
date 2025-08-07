import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { RtcModule } from './rtc/rtc.module';
import { AiModule } from './ai/ai.module';
import { ReportsModule } from './reports/reports.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [AuthModule, UsersModule, InterviewsModule, RtcModule, AiModule, ReportsModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
