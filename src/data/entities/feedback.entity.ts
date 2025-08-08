import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Interview } from '../../interviews/entities/interview.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Interview, { nullable: true })
  @JoinColumn({ name: 'interview_id' })
  interview?: Interview;

  @Column()
  feedbackType: string;

  @Column('text')
  feedbackText: string;

  @Column('int', { nullable: true })
  rating?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}