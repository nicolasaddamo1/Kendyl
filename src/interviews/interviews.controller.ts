// src/interviews/interview.controller.ts
import { Controller, Post, Patch, Param, Body, Get } from '@nestjs/common';
import { InterviewService } from './interviews.service';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('schedule')
  async scheduleInterview(
    @Body('candidateId') candidateId: string,
    @Body('jobId') jobId: string,
    @Body('date') date: string,
  ) {
    return this.interviewService.scheduleInterview(candidateId, jobId, new Date(date));
  }

  @Patch(':id/reschedule')
  async rescheduleInterview(
    @Param('id') id: string,
    @Body('newDate') newDate: string,
  ) {
    return this.interviewService.rescheduleInterview(id, new Date(newDate));
  }

  @Get(':id')
  async getInterview(@Param('id') id: string) {
    return this.interviewService.getInterview(id);
  }
}
