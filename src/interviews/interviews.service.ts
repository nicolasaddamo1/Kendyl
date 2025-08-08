// src/interviews/interview.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/data/entities/job.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async scheduleInterview(candidateId: string, jobId: string, date: Date) {
    const user = await this.userRepo.findOne({ where: { id: candidateId } });
    if (!user) throw new NotFoundException('Candidato no encontrado');

    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Trabajo no encontrado');

    // Podrías agregar validación para que el candidato haya aplicado al trabajo
    const interview = this.interviewRepo.create({
      candidate_id: candidateId,
      job_id: jobId,
      scheduledTime: date,
      status: 'scheduled',
    });

    return this.interviewRepo.save(interview);
  }

  async rescheduleInterview(interviewId: string, newDate: Date) {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId } });
    if (!interview) throw new NotFoundException('Entrevista no encontrada');

    if (interview.status === 'completed') {
      throw new BadRequestException('No se puede reprogramar una entrevista completada');
    }

    interview.scheduledTime = newDate;
    interview.status = 'rescheduled';
    return this.interviewRepo.save(interview);
  }

  async getInterview(interviewId: string) {
    return this.interviewRepo.findOne({
      where: { id: interviewId },
      relations: ['candidate', 'job'],
    });
  }
}
