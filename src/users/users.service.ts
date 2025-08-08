// src/users/users.service.ts
import { 
    Injectable, 
    NotFoundException, 
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from './entities/user.entity';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { PaginationDto } from '../data/dto/pagination.dto';
import { JobUser } from 'src/data/entities/job-user.entity';
import { Job } from 'src/data/entities/job.entity';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(JobUser)
      private readonly jobUserRepository: Repository<JobUser>,
    ) {}
  
    async getUserProfile(id: string) {
      const user = await this.userRepository.findOne({ 
        where: { id },
        select: ['id', 'username', 'email', 'role', 'createdAt'],
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      return user;
    }
  
    async getAllUsers(pagination: PaginationDto) {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;
  
      const [users, total] = await this.userRepository.findAndCount({
        select: ['id', 'username', 'email', 'role', 'createdAt'],
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });
  
      return {
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
      const user = await this.userRepository.findOne({ where: { id } });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Prevent email change to an existing email
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const emailExists = await this.userRepository.findOne({ 
          where: { email: updateUserDto.email },
        });
        if (emailExists) {
          throw new BadRequestException('Email already in use');
        }
      }
  
      // Update user fields
      const updatedUser = this.userRepository.merge(user, updateUserDto);
      await this.userRepository.save(updatedUser);
  
      // Return user without sensitive data
      const { password, ...result } = updatedUser;
      return result;
    }
  
    async findById(id: string) {
      return this.userRepository.findOne({ where: { id } });
    }

      async applyToJob(jobId: string, userId: string) {
        // 1. Verificar si ya aplicó
        const existing = await this.jobUserRepository.findOne({
          where: { job: { id: jobId }, user: { id: userId } },
        });
      
        if (existing) {
          throw new BadRequestException('Ya has aplicado a este trabajo');
        }
      
        // 2. Crear la aplicación
        const application = this.jobUserRepository.create({
          job: { id: jobId } as Job,
          user: { id: userId } as User,
        });
      
        return this.jobUserRepository.save(application);
      }
  }