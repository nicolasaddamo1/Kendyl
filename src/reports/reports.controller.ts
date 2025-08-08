// // src/reports/reports.controller.ts
// import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
// import { ReportsService } from './reports.service';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Role } from '../users/enums/role.enum';
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { User } from '../users/entities/user.entity';
// import { PaginationDto } from '../data/dto/pagination.dto';
// import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
// import { Roles } from 'src/auth/decorator/roles.decorator';

// @ApiTags('Reports')
// @ApiBearerAuth()
// @Controller('reports')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// export class ReportsController {
//   constructor(private readonly reportsService: ReportsService) {}

//   @Get('interview-summary/:interviewId')
//   @ApiOperation({ summary: 'Get detailed summary of a specific interview' })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Interview summary retrieved successfully' 
//   })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'Interview not found' })
//   async getInterviewSummary(
//     @Param('interviewId') interviewId: string,
//     @CurrentUser() user: User,
//   ) {
//     return this.reportsService.getInterviewSummary(interviewId, user);
//   }

//   @Get('candidate-performance/:candidateId')
//   @ApiOperation({ summary: 'Generate aggregated performance report for a candidate' })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Performance report retrieved successfully' 
//   })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'Candidate not found' })
//   async getCandidatePerformance(
//     @Param('candidateId') candidateId: string,
//     @Query() pagination: PaginationDto,
//     @CurrentUser() user: User,
//   ) {
//     return this.reportsService.getCandidatePerformance(
//       candidateId, 
//       pagination, 
//       user
//     );
//   }

//   @Get('skill-breakdown/:candidateId')
//   @Roles(Role.Admin, Role.Interviewer)
//   @ApiOperation({ summary: 'Get skill breakdown for a candidate' })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Skill breakdown retrieved successfully' 
//   })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'Candidate not found' })
//   async getSkillBreakdown(
//     @Param('candidateId') candidateId: string,
//     @CurrentUser() user: User,
//   ) {
//     return this.reportsService.getSkillBreakdown(candidateId, user);
//   }
// }