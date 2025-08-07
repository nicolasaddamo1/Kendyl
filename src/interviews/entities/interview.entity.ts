import { User } from 'src/users/entities/user.entity';
import {Entity, PrimaryColumn, Column, ManyToOne} from 'typeorm';

@Entity()
export class Interview {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  candidate_id: string;

  @ManyToOne(() => User, user => user.id)
  candidate: User;

  @Column()
  status: string;

  @Column()
  topic: string;

  @Column()
  total_score: number;
}
