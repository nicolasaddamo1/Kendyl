import { 
    IsString, 
    IsEmail, 
    IsOptional, 
    IsBoolean, 
    IsArray, 
    ValidateNested, 
    IsUrl,
    IsUUID
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { WorkExperience, Education, Project, Certification } from '../entities/resume.entity';
  
  export class CreateResumeDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsUUID()
    userId: string;
  
    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  
    @IsOptional()
    @IsUrl()
    linkedinUrl?: string;
  
    @IsOptional()
    @IsUrl()
    githubUrl?: string;
  
    @IsOptional()
    @IsUrl()
    portfolioUrl?: string;
  
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    summary?: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkExperienceDto)
    workExperience?: WorkExperienceDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education?: EducationDto[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technicalSkills?: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    softSkills?: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    languages?: string[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectDto)
    projects?: ProjectDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CertificationDto)
    certifications?: CertificationDto[];
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  
    @IsOptional()
    @IsString()
    templateId?: string;
  }
  
  // DTOs para objetos anidados
  export class WorkExperienceDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    company: string;
  
    @IsString()
    position: string;
  
    @IsString()
    startDate: string;
  
    @IsOptional()
    @IsString()
    endDate?: string;
  
    @IsBoolean()
    isCurrentJob: boolean;
  
    @IsString()
    description: string;
  
    @IsArray()
    @IsString({ each: true })
    achievements: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];
  }
  
  export class EducationDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    institution: string;
  
    @IsString()
    degree: string;
  
    @IsString()
    fieldOfStudy: string;
  
    @IsString()
    startDate: string;
  
    @IsOptional()
    @IsString()
    endDate?: string;
  
    @IsOptional()
    gpa?: number;
  
    @IsOptional()
    @IsString()
    description?: string;
  }
  
  export class ProjectDto{

    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    name: string;
  
    @IsString()
    description: string;
  
    @IsArray()
    @IsString({ each: true })
    technologies: string[];
  
    @IsOptional()
    @IsUrl()
    url?: string;
  
    @IsOptional()
    @IsUrl()
    githubUrl?: string;
  
    @IsString()
    startDate: string;
  
    @IsOptional()
    @IsString()
    endDate?: string;
  
    @IsArray()
    @IsString({ each: true })
    highlights: string[];
  }
  
  export class CertificationDto {
    @IsOptional()
    @IsString()
    id?: string;
    
    @IsString()
    name: string;
  
    @IsString()
    issuer: string;
  
    @IsString()
    issueDate: string;
  
    @IsOptional()
    @IsString()
    expirationDate?: string;
  
    @IsOptional()
    @IsString()
    credentialId?: string;
  
    @IsOptional()
    @IsUrl()
    url?: string;
  }