import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';

export class FeedbackDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  interviewId?: string;

  @ApiProperty()
  @IsString()
  feedbackType: string;

  @ApiProperty()
  @IsString()
  feedbackText: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

