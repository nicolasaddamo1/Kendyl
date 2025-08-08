// // src/responses/responses.service.ts
// import { 
//     Injectable, 
//     NotFoundException, 
//     ForbiddenException,
//   } from '@nestjs/common';
//   import { InjectRepository } from '@nestjs/typeorm';
//   import { Repository } from 'typeorm';
//   import { User } from '../users/entities/user.entity';
//   import { PaginationDto } from '../data/dto/pagination.dto';
// import { CreateResponseDto } from './dto/create-response.dto';
// import { Question } from 'src/interviews/entities/question.entity';
  
//   @Injectable()
//   export class ResponsesService {
//     constructor(
//       @InjectRepository(Response)
//       private readonly responseRepository: Repository<Response>,
//       @InjectRepository(Question)
//       private readonly questionRepository: Repository<Question>,
//       @InjectRepository(User)
//       private readonly userRepository: Repository<User>,
//     ) {}
  
//     async create(createResponseDto: CreateResponseDto, userId: string) {
//       const { questionId, responseText } = createResponseDto;
  
//       // Verify question exists
//       const question = await this.questionRepository.findOne({
//         where: { id: questionId },
//         relations: ['interview'],
//       });
  
//       if (!question) {
//         throw new NotFoundException('Question not found');
//       }
  
//       // Verify user is the candidate for this interview
//       if (question.interview.candidate_id !== userId) {
//         throw new ForbiddenException('You can only respond to your own interview questions');
//       }
  
//       // Create and save response
//       const response = this.responseRepository.create({
//         question: { id: questionId },
//         candidate: { id: userId },
//         response_text: responseText,
//       });
  
//       return this.responseRepository.save(response);
//     }
  
//     async findOne(id: string, user: User) {
//       const response = await this.responseRepository.findOne({
//         where: { id },
//         relations: ['question', 'question.interview', 'candidate'],
//       });
  
//       if (!response) {
//         throw new NotFoundException('Response not found');
//       }
  
//       // Check if user has access to this response
//       if (
//         user.role !== Role.Admin &&
//         user.id !== response.candidate.id &&
//         user.id !== response.question.interview.interviewer_id
//       ) {
//         throw new ForbiddenException('You do not have access to this response');
//       }
  
//       return response;
//     }
  
//     async findByQuestion(
//       questionId: string,
//       pagination: PaginationDto,
//       user: User,
//     ) {
//       // Verify question exists and user has access
//       const question = await this.questionRepository.findOne({
//         where: { id: questionId },
//         relations: ['interview'],
//       });
  
//       if (!question) {
//         throw new NotFoundException('Question not found');
//       }
  
//       if (
//         user.role !== Role.Admin &&
//         user.id !== question.interview.candidate_id) {
//         throw new ForbiddenException('You do not have access to these responses');
//       }
  
//       const { page = 1, limit = 10 } = pagination;
//       const skip = (page - 1) * limit;
  
//       const [responses, total] = await this.responseRepository.findAndCount({
//         where: { question: { id: questionId } },
//         relations: ['candidate'],
//         skip,
//         take: limit,
//         order: { created_at: 'ASC' },
//       });
  
//       return {
//         data: responses,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       };
//     }
  
//     async findByCandidate(
//       candidateId: string,
//       pagination: PaginationDto,
//       user: User,
//     ) {
//       // Verify candidate exists and user has access
//       const candidate = await this.userRepository.findOne({
//         where: { id: candidateId, role: Role.Candidate },
//       });
  
//       if (!candidate) {
//         throw new NotFoundException('Candidate not found');
//       }
  
//       if (user.role !== Role.Admin && user.id !== candidateId) {
//         throw new ForbiddenException('You can only view your own responses');
//       }
  
//       const { page = 1, limit = 10 } = pagination;
//       const skip = (page - 1) * limit;
  
//       const [responses, total] = await this.responseRepository.findAndCount({
//         where: { candidate: { id: candidateId } },
//         relations: ['question'],
//         skip,
//         take: limit,
//         order: { created_at: 'DESC' },
//       });
  
//       return {
//         data: responses,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       };
//     }
//   }