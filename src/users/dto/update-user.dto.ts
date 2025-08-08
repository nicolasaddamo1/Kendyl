// src/users/dto/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  IsIn,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({ enum: Role, required: false })
  @IsOptional()
  @IsIn(Object.values(Role))
  role?: Role;
}

