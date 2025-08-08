// src/data/data.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Query, Put, Patch, Delete } from '@nestjs/common';
import { DataService } from './data.service';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FeedbackDto } from './dto/feedback.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('Data')
@ApiBearerAuth()
@Controller('data')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('feedback')
  @ApiOperation({ summary: 'Submit feedback about the interview or system' })
  @ApiResponse({ status: 201, description: 'Feedback submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submitFeedback(@Body() feedbackDto: FeedbackDto) {
    return this.dataService.submitFeedback(feedbackDto);
  }

  @Get('ai-feedback-raw/:interviewId')
  // @Roles(Role.Admin, Role.Interviewer)
  @ApiOperation({ summary: 'Get raw AI feedback data for an interview' })
  @ApiResponse({ status: 200, description: 'Raw AI feedback data retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  async getRawAIFeedback(
    @Param('interviewId') interviewId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.dataService.getRawAIFeedback(interviewId, pagination);
  }

  @Post('resume')
  async createResume(@Body() createResumeDto: CreateResumeDto, @Body('userId') userId: string) {
    return this.dataService.createResume(createResumeDto, userId);
  }
  @Get('resumes')
  async getAllResumes() {
    return this.dataService.findAll();
  }

  @Get('resume/:id')
  async getResume(@Param('id') id: string) {
    return this.dataService.findOne(id);
  }

  @Get('user/:userId/resumes')
  async getUserResumes(@Param('userId') userId: string) {
    return this.dataService.findByUserId(userId);
  }

  @Get('user/:userId/resume/active')
  async getUserActiveResume(@Param('userId') userId: string) {
    return this.dataService.findActiveByUserId(userId);
  }

  @Put('resume/:id')
  async updateResume(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto
  ) {
    return this.dataService.update(id, updateResumeDto);
  }

  @Patch('resume/:id/activate')
  async setActiveResume(@Param('id') id: string) {
    return this.dataService.setActive(id);
  }

  @Delete('resume/:id')
  async deleteResume(@Param('id') id: string) {
    await this.dataService.remove(id);
    return { message: 'Resume deleted successfully' };
  }

  @Post('resume/:id/work-experience')
  async addWorkExperience(
    @Param('id') id: string,
    @Body() workExperience: any
  ) {
    return this.dataService.addWorkExperience(id, workExperience);
  }

  @Put('resume/:resumeId/work-experience/:experienceId')
  async updateWorkExperience(
    @Param('resumeId') resumeId: string,
    @Param('experienceId') experienceId: string,
    @Body() updateData: any
  ) {
    return this.dataService.updateWorkExperience(resumeId, experienceId, updateData);
  }

  @Delete('resume/:resumeId/work-experience/:experienceId')
  async removeWorkExperience(
    @Param('resumeId') resumeId: string,
    @Param('experienceId') experienceId: string
  ) {
    return this.dataService.removeWorkExperience(resumeId, experienceId);
  }

  @Get('resumes/search/skills')
  async searchBySkills(@Query('skills') skills: string) {
    const skillsArray = skills.split(',').map(s => s.trim());
    return this.dataService.searchBySkills(skillsArray);
  }

  @Post('job')
  async createJob(@Body() jobData: CreateJobDto): Promise<Job> {
    return this.dataService.createJob(jobData);
  }
}
