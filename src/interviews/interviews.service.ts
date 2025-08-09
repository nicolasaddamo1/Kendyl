// src/interviews/interview.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/data/entities/job.entity';
import { InterviewTranscription } from './entities/interview_transcription.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
    @InjectRepository(InterviewTranscription)
    private readonly interviewTranscriptionRepo: Repository<InterviewTranscription>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async scheduleInterview(candidate_id: string, job_id: string, scheduledTime: Date) {
    const user = await this.userRepo.findOne({ where: { id: candidate_id } });
    if (!user) throw new NotFoundException('Candidato no encontrado');

    const job = await this.jobRepo.findOne({ where: { id: job_id } });
    if (!job) throw new NotFoundException('Trabajo no encontrado');

    const interview = this.interviewRepo.create({
      candidate_id: candidate_id,
      job_id: job_id,
      scheduledTime: scheduledTime,
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

  async saveTranscript(question: string, answer: string) {
    const interview = this.interviewTranscriptionRepo.create({ question, answer });
    return this.interviewTranscriptionRepo.save(interview);
  }
}
