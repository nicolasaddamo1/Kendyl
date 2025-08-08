// src/ai/dto/send-avatar-text.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendAvatarTextDto {
  @ApiProperty()
  @IsString()
  avatarSessionId: string;

  @ApiProperty()
  @IsString()
  text: string;
}