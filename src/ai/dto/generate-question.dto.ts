// src/ai/dto/generate-question.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator';

export class GenerateQuestionDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty({ minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  difficulty: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousQuestions?: string[];
}