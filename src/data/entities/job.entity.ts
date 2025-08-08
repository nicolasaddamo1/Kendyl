import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { JobUser } from "./job-user.entity";
import { Interview } from "src/interviews/entities/interview.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    salary: number;

    @Column()
    location: string;

    @Column()
    type: string;

    @Column()
    category: string;

    @Column()
    experience: string;

    @Column()
    education: string;

    @Column()
    company: string;

    @Column()
    logo: string;

    @Column()
    url: string;

    @Column()
    is_active: boolean;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @OneToMany(() => JobUser, (jobUser) => jobUser.job)
    jobUsers: JobUser[];

    @OneToMany(() => Interview, (interview) => interview.job)
    interviews: Interview[];
}
