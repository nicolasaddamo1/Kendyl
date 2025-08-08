// // src/reports/reports.service.ts
// import { 
//     Injectable, 
//     NotFoundException, 
//     ForbiddenException 
//   } from '@nestjs/common';
//   import { InjectRepository } from '@nestjs/typeorm';
//   import { Repository } from 'typeorm';
//   import { Interview } from '../interviews/entities/interview.entity';
//   import { User } from '../users/entities/user.entity';
//   import { PaginationDto } from '../data/dto/pagination.dto';
// import { Question } from 'src/interviews/entities/question.entity';
// import { Response } from 'src/interviews/entities/responses.entity';
// import { Role } from 'src/users/enums/role.enum';
  
//   @Injectable()
//   export class ReportsService {
//     constructor(
//       @InjectRepository(Interview)
//       private readonly interviewRepository: Repository<Interview>,
//       @InjectRepository(User)
//       private readonly userRepository: Repository<User>,
//       @InjectRepository(Question)
//       private readonly questionRepository: Repository<Question>,
//       @InjectRepository(Response)
//       private readonly responseRepository: Repository<Response>,
//     ) {}
  
//     async getInterviewSummary(interviewId: string, currentUser: User) {
//       // Get interview with relations
//       const interview = await this.interviewRepository.findOne({
//         where: { id: interviewId },
//         relations: ['candidate', 'interviewer', 'questions'],
//       });
  
//       if (!interview) {
//         throw new NotFoundException('Interview not found');
//       }
  
//       // Check if current user is authorized to view this report
//       if (
//         currentUser.id !== interview.candidate.id &&
//         currentUser.role !== Role.Admin
//       ) {
//         throw new ForbiddenException(
//           'You are not authorized to view this report'
//         );
//       }
  
//       // Get all questions and responses for this interview
//       const questions = await this.questionRepository.find({
//         where: { interview: { id: interviewId } },
//         relations: ['responses'],
//         order: { created_at: 'ASC' },
//       });
//       const responses = await this.responseRepository.find({
//         where: { question: { interview: { id: interviewId } } },
//         relations: ['question'],
//         order: { created_at: 'ASC' },
//       });

//       // Calculate overall scores
//         const scores = responses.flatMap(r => r.ai_evaluation_score || []);
//         if (scores.length === 0) {
//           throw new NotFoundException('No scores found for this interview');
//         }
   
      
//       const averageScore = scores.length > 0 
//         ? scores.reduce((a, b) => a + b, 0) / scores.length 
//         : 0;
  
//       // Structure question-level feedback
//       const questionDetails = questions.map(question => {
//         const response = responses.find(r => r.question.id === question.id);
//         if (!response) {
//           return {
//             questionId: question.id,
//             questionText: question.question_text,
//             difficulty: question.difficulty,
//             response: null,
//             score: null,
//             feedback: null,
//           };
//         }
        
//         return {
//           questionId: question.id,
//           questionText: question.question_text,
//           difficulty: question.difficulty,
//           response: response ? response.response_text : null,
//           score: response ? response.ai_evaluation_score : null,
//           feedback: response ? response.ai_feedback_json : null,
//         };
//       });
  
//       // Get strengths and weaknesses from feedback
//       const strengths = this.extractFeedbackKeywords(questionDetails, 'strengths');
//       const weaknesses = this.extractFeedbackKeywords(questionDetails, 'weaknesses');
  
//       return {
//         interviewId: interview.id,
//         topic: interview.topic,
//         date: interview.scheduledTime,
//         duration: interview.duration,
//         status: interview.status,
//         candidate: {
//           id: interview.candidate.id,
//           name: interview.candidate.username,
//         },

//         overallScore: averageScore,
//         questionDetails,
//         strengths,
//         weaknesses,
//         createdAt: new Date(),
//       };
//     }
  
//     async getCandidatePerformance(
//       candidateId: string,
//       pagination: PaginationDto,
//       currentUser: User,
//     ) {
//       // Verify candidate exists
//       const candidate = await this.userRepository.findOne({ 
//         where: { id: candidateId, role: 'Candidate' } 
//       });
//       if (!candidate) {
//         throw new NotFoundException('Candidate not found');
//       }
  
//       // Check if current user is authorized to view this report
//       if (
//         currentUser.id !== candidateId &&
//         currentUser.role !== Role.Admin &&
//         currentUser.role !== Role.Interviewer
//       ) {
//         throw new ForbiddenException(
//           'You are not authorized to view this report'
//         );
//       }
  
//       const { page = 1, limit = 10 } = pagination;
//       const skip = (page - 1) * limit;
  
//       // Get all completed interviews for this candidate
//       const [interviews, total] = await this.interviewRepository.findAndCount({
//         where: { 
//           candidate: { id: candidateId },
//           status: 'completed',
//         },
//         relations: ['questions', 'questions.responses'],
//         skip,
//         take: limit,
//         order: { scheduledTime: 'DESC' },
//       });
  
//       // Calculate performance metrics
//       const completedInterviews = interviews.filter(i => i.status === 'completed');
//       const totalInterviews = completedInterviews.length;
  
//       const allScores = completedInterviews
          
//                   .filter(score => score !== null && score !== undefined);
  
//       const averageScore = allScores.length > 0
//         ? allScores.reduce((a, b) => a + b, 0) / allScores.length
//         : 0;
  
//       // Get topic distribution
//       const topicDistribution = this.calculateTopicDistribution(completedInterviews);
  
//       // Get progress over time
//       const progressOverTime = this.calculateProgressOverTime(completedInterviews);
  
//       return {
//         candidate: {
//           id: candidate.id,
//           name: candidate.username,
//         },
//         metrics: {
//           totalInterviews,
//           averageScore,
//           highestScore: allScores.length > 0 ? Math.max(...allScores) : 0,
//           lowestScore: allScores.length > 0 ? Math.min(...allScores) : 0,
//         },
//         topicDistribution,
//         progressOverTime,
//         recentInterviews: completedInterviews.map(interview => ({
//           id: interview.id,
//           date: interview.scheduledTime,
//           topic: interview.topic,
//           score: interview.questions.length > 0
//             ? interview.questions
//                 .flatMap(q => q.responses.map(r => r.ai_evaluation_score))
//                 .reduce((a, b) => a + b, 0) / interview.questions.length
//             : 0,
//         })),
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       };
//     }
  
//     async getSkillBreakdown(candidateId: string, currentUser: User) {
//       // Verify candidate exists
//       const candidate = await this.userRepository.findOne({ 
//         where: { id: candidateId, role: 'Candidate' } 
//       });
//       if (!candidate) {
//         throw new NotFoundException('Candidate not found');
//       }
  
//       // Check if current user is authorized to view this report
//       if (
//         currentUser.role !== Role.Admin &&
//         currentUser.role !== Role.Interviewer
//       ) {
//         throw new ForbiddenException(
//           'You are not authorized to view this report'
//         );
//       }
  
//       // Get all completed interviews and responses for this candidate
//       const interviews = await this.interviewRepository.find({
//         where: { 
//           candidate: { id: candidateId },
//           status: 'completed',
//         },
//         relations: ['questions', 'questions.responses'],
//       });
  
//       // Extract all feedback from responses
//       const allFeedback = interviews
//         .flatMap(i => i.questions
//           .flatMap(q => q.responses
//             .map(r => r.ai_feedback_json)
//           )
//         )
//         .filter(feedback => feedback !== null && feedback !== undefined);
  
//       // Analyze skills from feedback (simplified example)
//       const skillBreakdown = this.analyzeSkillsFromFeedback(allFeedback);
  
//       return {
//         candidate: {
//           id: candidate.id,
//           name: candidate.username,
//         },
//         skillBreakdown,
//         generatedAt: new Date(),
//       };
//     }
  
//     private extractFeedbackKeywords(questionDetails: any[], type: 'strengths' | 'weaknesses') {
//       const keywords = questionDetails
//         .flatMap(qd => 
//           qd.feedback && qd.feedback[type] 
//             ? qd.feedback[type] 
//             : []
//         )
//         .filter(k => k);
  
//       // Count occurrences of each keyword
//       const keywordCounts = keywords.reduce((acc, keyword) => {
//         acc[keyword] = (acc[keyword] || 0) + 1;
//         return acc;
//       }, {});
  
//       // Sort by frequency
//       return Object.entries(keywordCounts)
//         .sort((a, b) => b[1] - a[1])
//         .map(([keyword, count]) => ({ keyword, count }));
//     }
  
//     private calculateTopicDistribution(interviews: Interview[]) {
//       const topicCounts = interviews.reduce((acc, interview) => {
//         const topic = interview.topic || 'General';
//         acc[topic] = (acc[topic] || 0) + 1;
//         return acc;
//       }, {});
  
//       const total = interviews.length;
      
//       return Object.entries(topicCounts).map(([topic, count]) => ({
//         topic,
//         count,
//         percentage: Math.round((count as number / total) * 100),
//       }));
//     }
  
//     private calculateProgressOverTime(interviews: Interview[]) {
//       // Sort interviews by date
//       const sortedInterviews = [...interviews].sort((a, b) => 
//         new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
//       );
  
//       return sortedInterviews.map(interview => {
//         const questions = interview.questions || [];
//         const averageScore = questions.length > 0
//           ? questions
//               .flatMap(q => q.responses.map(r => r.ai_evaluation_score))
//               .reduce((a, b) => a + b, 0) / questions.length
//           : 0;
  
//         return {
//           date: interview.scheduledTime,
//           topic: interview.topic,
//           score: averageScore,
//         };
//       });
//     }
  
//     private analyzeSkillsFromFeedback(feedbacks: any[]) {
//       // This is a simplified example - in a real app you'd use more sophisticated analysis
//       const skills = [
//         'Problem Solving', 'Algorithm Knowledge', 'System Design', 
//         'Communication', 'Code Quality', 'Technical Knowledge',
//         'Time Management', 'Debugging', 'Testing',
//       ];
  
//       const skillAnalysis = {};
  
//       skills.forEach(skill => {
//         const mentions = feedbacks.filter(feedback => 
//           feedback && 
//           JSON.stringify(feedback).toLowerCase().includes(skill.toLowerCase())
//         ).length;
  
//         skillAnalysis[skill] = {
//           mentions,
//           averageScore: this.calculateAverageScoreForSkill(feedbacks, skill),
//         };
//       });
  
//       return skillAnalysis;
//     }
  
//     private calculateAverageScoreForSkill(feedbacks: any[], skill: string) {
//       const relevantFeedbacks = feedbacks.filter(feedback => 
//         feedback && 
//         JSON.stringify(feedback).toLowerCase().includes(skill.toLowerCase())
//       );
  
//       if (relevantFeedbacks.length === 0) return 0;
  
//       const scores = relevantFeedbacks
//         .map(f => f.overallScore || f.score)
//         .filter(score => score !== undefined && score !== null);
  
//       return scores.length > 0 
//         ? scores.reduce((a, b) => a + b, 0) / scores.length 
//         : 0;
//     }
//   }