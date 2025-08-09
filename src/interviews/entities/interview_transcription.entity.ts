// interview.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class InterviewTranscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  question: string;

  @Column('text')
  answer: string;

  @CreateDateColumn()
  createdAt: Date;
}
