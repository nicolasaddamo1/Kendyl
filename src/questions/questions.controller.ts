// src/questions/questions.controller.ts
import { 
    Controller, 
    Get, 
    Param, 
    UseGuards, 
    Post, 
    Body,
    Query,
  } from '@nestjs/common';
//   import { QuestionsService } from './questions.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Role } from '../users/enums/role.enum';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { User } from '../users/entities/user.entity';
  import { PaginationDto } from '../data/dto/pagination.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
  
  @ApiTags('Questions')
  @ApiBearerAuth()
  @Controller('questions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class QuestionsController {
    // constructor(private readonly questionsService: QuestionsService) {}
  
    @Post()
    @Roles(Role.Interviewer, Role.Admin)
    @ApiOperation({ summary: 'Create a new question' })
    @ApiResponse({ status: 201, description: 'Question created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(
      @Body() createQuestionDto: CreateQuestionDto,
      @CurrentUser() user: User,
    ) {
    //   return this.questionsService.create(createQuestionDto, user.id);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get question by ID' })
    @ApiResponse({ status: 200, description: 'Question retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Question not found' })
    async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    //   return this.questionsService.findOne(id, user);
    }
  
    @Get('interview/:interviewId')
    @ApiOperation({ summary: 'Get all questions for an interview' })
    @ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findByInterview(
      @Param('interviewId') interviewId: string,
      @Query() pagination: PaginationDto,
      @CurrentUser() user: User,
    ) {
    //   Logic for adding questions to an interview Using OpenAi API and Heygen AI
    
    }
  }