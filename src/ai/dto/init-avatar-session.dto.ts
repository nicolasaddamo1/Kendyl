// src/ai/dto/init-avatar-session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class InitAvatarSessionDto {
  @ApiProperty()
  @IsString()
  avatarId: string;

  @ApiProperty({ type: Object })
  @IsObject()
  voiceSettings: Record<string, any>;
}