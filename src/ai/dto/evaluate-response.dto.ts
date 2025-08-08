// src/ai/dto/evaluate-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class EvaluateResponseDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsString()
  candidateResponseText: string;
}