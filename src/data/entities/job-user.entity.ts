import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Column,
    Unique,
  } from 'typeorm';
  import { Job } from './job.entity';
import { User } from 'src/users/entities/user.entity';
  
  @Entity()
  @Unique(['job', 'user']) // evita que un usuario aplique dos veces al mismo trabajo
  export class JobUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Job, (job) => job.jobUsers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;
  
    @ManyToOne(() => User, (user) => user.jobUsers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  }
  