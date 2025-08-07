import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Interview } from './interview.entity';

@Entity()
export class Question {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  interview_id: string;

  @Column()
  question_text: string;

  @Column()
  difficulty: number;

  @Column()
  created_at: Date;

  @Column()
  deleted_at: Date;

  @ManyToOne(() => Interview, (interview) => interview.id)
  interview: Interview;
}
