// src/interviews/interview.controller.ts
import { Controller, Post, Patch, Param, Body, Get } from '@nestjs/common';
import { InterviewService } from './interviews.service';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('schedule')
  async scheduleInterview(
    @Body('candidate_id') candidate_id: string,
    @Body('job_id') job_id: string,
    @Body('scheduledTime') scheduledTime: string, // primero string
  ) {
    console.log(new Date(scheduledTime)); // convertir a Date
    return this.interviewService.scheduleInterview(
      candidate_id,
      job_id,
      new Date(scheduledTime), 
    );
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
