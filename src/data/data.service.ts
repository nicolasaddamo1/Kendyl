// src/data/data.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Interview } from '../interviews/entities/interview.entity';
import { User } from '../users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { FeedbackDto } from './dto/feedback.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Resume } from './entities/resume.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async submitFeedback(feedbackDto: FeedbackDto) {
  }

  async getRawAIFeedback(interviewId: string, pagination: PaginationDto) {
 
  }

  async createResume(createResumeDto: CreateResumeDto, userId: string): Promise<Resume> {

    const existingActiveResume = await this.resumeRepository.findOne({
      where: { userId: createResumeDto.userId, isActive: true },
    });

    if (createResumeDto.isActive && existingActiveResume) {
      await this.resumeRepository.update(
        { id: existingActiveResume.id },
        { isActive: false }
      );
    }

    const resumeData = {
      ...createResumeDto,
      workExperience: createResumeDto.workExperience?.map(exp => ({
        ...exp,
        id: uuidv4(),
      })) || [],
      education: createResumeDto.education?.map(edu => ({
        ...edu,
        id: uuidv4(),
      })) || [],
      projects: createResumeDto.projects?.map(project => ({
        ...project,
        id: uuidv4(),
      })) || [],
      certifications: createResumeDto.certifications?.map(cert => ({
        ...cert,
        id: uuidv4(),
      })) || [],
      user: { id: userId } 

    };

    const resume = this.resumeRepository.create(resumeData);
    return await this.resumeRepository.save(resume);
  }

  async findAll(): Promise<Resume[]> {
    return await this.resumeRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Resume[]> {
    return await this.resumeRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<Resume | null> {
    return await this.resumeRepository.findOne({
      where: { userId, isActive: true },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Resume> {
    const resume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${id} not found`);
    }

    return resume;
  }

  async update(id: string, updateResumeDto: UpdateResumeDto): Promise<Resume> {
    const resume = await this.findOne(id);

    // Si se está activando este resume, desactivar otros del mismo usuario
    if (updateResumeDto.isActive === true) {
      await this.resumeRepository.update(
        { userId: resume.userId, id: { $ne: id } } as any,
        { isActive: false }
      );
    }

    // Actualizar IDs en objetos anidados si es necesario
    const updatedData = { ...updateResumeDto };
    
    if (updateResumeDto.workExperience) {
      updatedData.workExperience = updateResumeDto.workExperience.map(exp => ({
        ...exp,
        id: exp.id || uuidv4(),
      }));
    }

    if (updateResumeDto.education) {
      updatedData.education = updateResumeDto.education.map(edu => ({
        ...edu,
        id: edu.id || uuidv4(),
      }));
    }

    if (updateResumeDto.projects) {
      updatedData.projects = updateResumeDto.projects.map(project => ({
        ...project,
        id: project.id || uuidv4(),
      }));
    }

    if (updateResumeDto.certifications) {
      updatedData.certifications = updateResumeDto.certifications.map(cert => ({
        ...cert,
        id: cert.id || uuidv4(),
      }));
    }

    await this.resumeRepository.update(id, updatedData);
    return await this.findOne(id);
  }

  async setActive(id: string): Promise<Resume> {
    const resume = await this.findOne(id);
    
    // Desactivar otros resumes del mismo usuario
    await this.resumeRepository.update(
      { userId: resume.userId, id: { $ne: id } } as any,
      { isActive: false }
    );

    // Activar el resume seleccionado
    await this.resumeRepository.update(id, { isActive: true });
    
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const resume = await this.findOne(id);
    await this.resumeRepository.remove(resume);
  }

  // Métodos de utilidad
  async addWorkExperience(resumeId: string, workExperience: any): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    const newExperience = {
      ...workExperience,
      id: uuidv4(),
    };

    resume.workExperience = [...(resume.workExperience || []), newExperience];
    
    return await this.resumeRepository.save(resume);
  }

  async updateWorkExperience(resumeId: string, experienceId: string, updateData: any): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    const experienceIndex = resume.workExperience?.findIndex(exp => exp.id === experienceId);
    
    if (experienceIndex === -1) {
      throw new NotFoundException(`Work experience with ID ${experienceId} not found`);
    }

    if (resume.workExperience) {
      resume.workExperience[experienceIndex] = {
        ...resume.workExperience[experienceIndex],
        ...updateData,
      };
    }

    return await this.resumeRepository.save(resume);
  }

  async removeWorkExperience(resumeId: string, experienceId: string): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    resume.workExperience = resume.workExperience?.filter(exp => exp.id !== experienceId) || [];
    
    return await this.resumeRepository.save(resume);
  }

  // Métodos similares para education, projects, certifications...
  async addEducation(resumeId: string, education: any): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    const newEducation = {
      ...education,
      id: uuidv4(),
    };

    resume.education = [...(resume.education || []), newEducation];
    
    return await this.resumeRepository.save(resume);
  }

  async addProject(resumeId: string, project: any): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    const newProject = {
      ...project,
      id: uuidv4(),
    };

    resume.projects = [...(resume.projects || []), newProject];
    
    return await this.resumeRepository.save(resume);
  }

  async addCertification(resumeId: string, certification: any): Promise<Resume> {
    const resume = await this.findOne(resumeId);
    
    const newCertification = {
      ...certification,
      id: uuidv4(),
    };

    resume.certifications = [...(resume.certifications || []), newCertification];
    
    return await this.resumeRepository.save(resume);
  }

  // Búsquedas y filtros avanzados
  async searchBySkills(skills: string[]): Promise<Resume[]> {
    const query = this.resumeRepository.createQueryBuilder('resume')
      .leftJoinAndSelect('resume.user', 'user')
      .where('resume.isActive = :isActive', { isActive: true });

    skills.forEach((skill, index) => {
      query.andWhere(
        `resume.technicalSkills ILIKE :skill${index} OR resume.softSkills ILIKE :skill${index}`,
        { [`skill${index}`]: `%${skill}%` }
      );
    });

    return await query.getMany();
  }

  async findByExperienceLevel(minYears: number): Promise<Resume[]> {
    // Esta es una búsqueda compleja que requeriría calcular años de experiencia
    // desde el JSON de workExperience
    return await this.resumeRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }

  async createJob (jobData: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(jobData);
    return await this.jobRepository.save(job);
  }

  async findAllJobs(): Promise<Job[]> {
    return await this.jobRepository.find();
  }

  async findJobById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id: id });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }


}
