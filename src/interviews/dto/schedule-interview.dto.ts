// src/interviews/dto/schedule-interview.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsUUID, 
  IsString, 
  IsDateString, 
  IsNumber, 
  IsOptional, 
  IsObject 
} from 'class-validator';

export class ScheduleInterviewDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  interviewerId?: string;

  @ApiProperty()
  @IsString()
  interviewType: string;

  @ApiProperty()
  @IsDateString()
  scheduledTime: string;

  @ApiProperty()
  @IsNumber()
  duration: number; // in minutes

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  aiInterviewerConfig?: Record<string, any>;
}




