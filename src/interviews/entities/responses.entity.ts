import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Response {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  question_id: string;

  @ManyToOne(() => Question, (question) => question.id)
  question: Question;

  @Column()
  candidate_id: string;

  @Column()
  response_text: string;

  @Column()
  ai_evaluation_score: number;

  @Column('jsonb')
  ai_feedback_json: object;
}
