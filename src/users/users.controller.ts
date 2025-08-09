// src/users/users.controller.ts
import { 
    Controller, 
    Get, 
    Param, 
    UseGuards, 
    Patch, 
    Body, 
    Query,
    ForbiddenException,
    Post,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Role } from './enums/role.enum';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from './entities/user.entity';
  import { PaginationDto } from '../data/dto/pagination.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
  
  @ApiTags('Users')
  @ApiBearerAuth()
  @Controller('users')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@CurrentUser() user: User) {
      return this.usersService.getUserProfile(user.id);
    }
  
    @Get(':id')
    // @Roles(Role.Admin)
    @ApiOperation({ summary: 'Get user by ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string, @CurrentUser() currentUser: User) {
      // Users can only view their own profile unless they're admin
      if (currentUser.id !== id && currentUser.role !== Role.Admin) {
        throw new ForbiddenException('You can only view your own profile');
      }
      return this.usersService.getUserProfile(id);
    }
  
    @Get()
    // @Roles(Role.Admin)
    @ApiOperation({ summary: 'List all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'Users list retrieved' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getAllUsers(
      @Query() pagination: PaginationDto,
      @CurrentUser() currentUser: User,
    ) {
      return this.usersService.getAllUsers(pagination);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto,
      @CurrentUser() currentUser: User,
    ) {
      // Users can only update their own profile unless they're admin
      if (currentUser.id !== id && currentUser.role !== Role.Admin) {
        throw new ForbiddenException('You can only update your own profile');
      }
      
      // Admins can't demote themselves
      if (
        currentUser.id === id && 
        currentUser.role === Role.Admin && 
        updateUserDto.role && 
        updateUserDto.role !== Role.Admin
      ) {
        throw new ForbiddenException('Admins cannot demote themselves');
      }
  
      return this.usersService.updateUser(id, updateUserDto);
    }

    @Post('apply-job/:jobId')
    @ApiOperation({ summary: 'Apply for a job' })
    @ApiResponse({ status: 201, description: 'Job application submitted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Job not found' })
    async applyForJob(
      @Param('jobId') jobId: string,
      @Body('userId') userId: string,
      // @CurrentUser() user: User,
    ) {
      return this.usersService.applyToJob(jobId, userId);
    }
    
  }