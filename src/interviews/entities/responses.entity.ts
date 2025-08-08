import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
