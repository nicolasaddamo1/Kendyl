// src/responses/responses.controller.ts
import { 
    Controller, 
    Get, 
    Param, 
    UseGuards, 
    Post, 
    Body,
    Query,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { User } from '../users/entities/user.entity';
  import { PaginationDto } from '../data/dto/pagination.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CreateResponseDto } from './dto/create-response.dto';
  
  @ApiTags('Responses')
  @ApiBearerAuth()
  @Controller('responses')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class ResponsesController {
    // constructor(private readonly responsesService: ResponsesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a response to a question' })
    @ApiResponse({ status: 201, description: 'Response created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(
      @Body() createResponseDto: CreateResponseDto,
      @CurrentUser() user: User,
    ) {
    //   return this.responsesService.create(createResponseDto, user.id);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get response by ID' })
    @ApiResponse({ status: 200, description: 'Response retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Response not found' })
    async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    //   return this.responsesService.findOne(id, user);
    }
  
    @Get('question/:questionId')
    @ApiOperation({ summary: 'Get all responses for a question' })
    @ApiResponse({ status: 200, description: 'Responses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findByQuestion(
      @Param('questionId') questionId: string,
      @Query() pagination: PaginationDto,
      @CurrentUser() user: User,
    ) {
    //   return this.responsesService.findByQuestion(questionId, pagination, user);
    }
  
    @Get('candidate/:candidateId')
    @ApiOperation({ summary: 'Get all responses for a candidate' })
    @ApiResponse({ status: 200, description: 'Responses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findByCandidate(
      @Param('candidateId') candidateId: string,
      @Query() pagination: PaginationDto,
      @CurrentUser() user: User,
    ) {
    //   return this.responsesService.findByCandidate(candidateId, pagination, user);
    }
  }