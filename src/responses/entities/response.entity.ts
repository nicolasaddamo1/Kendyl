// src/responses/entities/response.entity.ts
import { 
    Entity, 
    PrimaryColumn, 
    Column, 
    ManyToOne, 
    JoinColumn,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Question } from '../../questions/entities/question.entity';
  import { User } from '../../users/entities/user.entity';
  
  @Entity()
  export class Response {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column({ name: 'question_id' })
    questionId: string;
  
    @ManyToOne(() => Question, (question) => question.responses)
    @JoinColumn({ name: 'question_id' })
    question: Question;
  
    @Column({ name: 'candidate_id' })
    candidateId: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'candidate_id' })
    candidate: User;
  
    @Column({ name: 'response_text' })
    responseText: string;
  
    @Column({ 
      name: 'ai_evaluation_score',
      type: 'decimal', 
      precision: 5, 
      scale: 2,
      nullable: true 
    })
    aiEvaluationScore?: number;
  
    @Column({ 
      name: 'ai_feedback_json',
      type: 'jsonb',
      nullable: true 
    })
    aiFeedbackJson?: Record<string, any>;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;
  }