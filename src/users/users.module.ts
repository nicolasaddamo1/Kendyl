// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JobUser } from 'src/data/entities/job-user.entity';
import { Job } from 'src/data/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, JobUser, Job]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}