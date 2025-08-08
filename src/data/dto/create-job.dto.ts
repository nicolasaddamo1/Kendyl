import { IsString, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  salary: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  experience: string;

  @ApiProperty()
  @IsString()
  education: string;

  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsUrl()
  logo: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}

