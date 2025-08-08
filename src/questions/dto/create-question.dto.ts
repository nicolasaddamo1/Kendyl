// src/questions/dto/create-question.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsUUID, 
  IsString, 
  IsNumber, 
  Min, 
  Max, 
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty()
  @IsString()
  questionText: string;

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  difficulty: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expectedAnswer?: string;
}