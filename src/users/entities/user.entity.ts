import { JobUser } from 'src/data/entities/job-user.entity';
import { Interview } from 'src/interviews/entities/interview.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => JobUser, (jobUser) => jobUser.user)
jobUsers: JobUser[];

@OneToMany(() => Interview, (interview) => interview.candidate)
interviews: Interview[];

}
