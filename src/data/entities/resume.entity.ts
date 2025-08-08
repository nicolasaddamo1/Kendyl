// src/modules/data/entities/resume.entity.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('resumes')
  export class Resume {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Relación con usuario
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ name: 'user_id' })
    userId: string;
  
    // Información Personal
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    phone: string;
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    city: string;
  
    @Column({ nullable: true })
    country: string;
  
    @Column({ nullable: true })
    linkedinUrl: string;
  
    @Column({ nullable: true })
    githubUrl: string;
  
    @Column({ nullable: true })
    portfolioUrl: string;
  
    // Información Profesional
    @Column({ nullable: true })
    title: string; // Ej: "Senior Frontend Developer"
  
    @Column('text', { nullable: true })
    summary: string; // Resumen profesional
  
    // Experiencia Laboral (JSON array)
    @Column('jsonb', { default: [] })
    workExperience: WorkExperience[];
  
    // Educación (JSON array)
    @Column('jsonb', { default: [] })
    education: Education[];
  
    // Habilidades
    @Column('simple-array', { nullable: true })
    technicalSkills: string[]; // ["JavaScript", "React", "Node.js"]
  
    @Column('simple-array', { nullable: true })
    softSkills: string[]; // ["Leadership", "Communication"]
  
    @Column('simple-array', { nullable: true })
    languages: string[]; // ["Spanish (Native)", "English (Fluent)"]
  
    // Proyectos (JSON array)
    @Column('jsonb', { default: [] })
    projects: Project[];
  
    // Certificaciones (JSON array)
    @Column('jsonb', { default: [] })
    certifications: Certification[];
  
    // Metadata
    @Column({ default: false })
    isActive: boolean; // Si es el CV activo del usuario
  
    @Column({ nullable: true })
    templateId: string; // Para diferentes plantillas de CV
  
    @CreateDateColumn()
    createdAt: Date = new Date();
  
    @UpdateDateColumn()
    updatedAt: Date= new Date();
  }
  
  // Interfaces para los campos JSON
  export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string; // YYYY-MM
    endDate?: string; // YYYY-MM o null si es trabajo actual
    isCurrentJob: boolean;
    description: string;
    achievements: string[];
    technologies?: string[];
  }
  
  export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string; // YYYY-MM
    endDate?: string; // YYYY-MM
    gpa?: number;
    description?: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
    startDate: string;
    endDate?: string;
    highlights: string[];
  }
  
  export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: string; // YYYY-MM
    expirationDate?: string; // YYYY-MM
    credentialId?: string;
    url?: string;
  }