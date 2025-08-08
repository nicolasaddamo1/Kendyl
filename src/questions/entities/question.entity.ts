// src/questions/entities/question.entity.ts
import { 
    Entity, 
    PrimaryColumn, 
    Column, 
    ManyToOne, 
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Interview } from '../../interviews/entities/interview.entity';
import { Response } from 'src/interviews/entities/responses.entity';
  
  @Entity()
  export class Question {
    @PrimaryColumn('uuid')
    id: string;
  
    @ManyToOne(() => Interview, (interview) => interview.questions)
    @JoinColumn({ name: 'interview_id' })
    interview: Interview;
  
    @Column({ name: 'question_text' })
    questionText: string;
  
    @Column()
    difficulty: number;
  
    @Column({ name: 'expected_answer', nullable: true })
    expectedAnswer?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;
  
    @OneToMany(() => Response, (response) => response.question)
    responses: Response[];
  }