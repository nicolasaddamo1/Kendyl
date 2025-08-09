// src/interviews/entities/interview.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Job } from 'src/data/entities/job.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con el candidato
  @ManyToOne(() => User, (user) => user.interviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  candidate: User;

  @Column()
  candidate_id: string;

  // Relación con el trabajo
  @ManyToOne(() => Job, (job) => job.interviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column()
  job_id: string;

  // Estado de la entrevista
  @Column({ default: 'scheduled' })
  status: string; // scheduled, completed, canceled, rescheduled

  // Tema / título
  @Column({ nullable: true })
  topic: string;

  // Puntuación total (al final de la entrevista)
  @Column({ type: 'float', nullable: true })
  total_score: number;

  // Fecha programada
  @Column({ type: 'timestamp', nullable: false })
  scheduledTime: Date;

  // Fecha completada
  @Column({ type: 'timestamp', nullable: true })
  completedTime?: Date;

  // Duración en minutos
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Column({  nullable: true })
  questions: string;
  // Futuras preguntas para IA (todavía sin usar)
  // @OneToMany(() => Question, (question) => question.interview)
  // questions: Question[];

  // Preparado para IA con OpenAI y Heygen (futuro)
  // aiPrompt: string;
  // videoUrl: string;
}
