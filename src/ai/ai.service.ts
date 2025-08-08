// src/ai/ai.service.ts
import { 
    Injectable, 
    Logger,
    BadRequestException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';

  import { Interview } from '../interviews/entities/interview.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { OpenAIService } from './providers/openai.service';
import { HeygenService } from './providers/heygen.service';
import { EvaluationRubric } from 'src/interviews/entities/evaluation_rubrics.entity';
import { GenerateQuestionDto } from './dto/generate-question.dto';
import { EvaluateResponseDto } from './dto/evaluate-response.dto';
import { SendAvatarTextDto } from './dto/send-avatar-text.dto';
import { InitAvatarSessionDto } from './dto/init-avatar-session.dto';
import { Response } from 'src/responses/entities/response.entity';
import { Question } from 'src/questions/entities/question.entity';

  
  @Injectable()
  export class AiService {
    private readonly logger = new Logger(AiService.name);
  
    constructor(
      private readonly configService: ConfigService,
      private readonly openAIService: OpenAIService,
      private readonly heygenService: HeygenService,
      @InjectRepository(Interview)
      private readonly interviewRepository: Repository<Interview>,
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>,
      @InjectRepository(Response)
      private readonly responseRepository: Repository<Response>,
      @InjectRepository(EvaluationRubric)
      private readonly rubricRepository: Repository<EvaluationRubric>,
    ) {}
  
    async generateQuestion(generateQuestionDto: GenerateQuestionDto) {
      const { interviewId, topic, difficulty, previousQuestions } = generateQuestionDto;
  
      // Get interview context
      const interview = await this.interviewRepository.findOne({ 
        where: { id: interviewId },
        relations: ['candidate'],
      });
  
      if (!interview) {
        throw new BadRequestException('Interview not found');
      }
  
      // Get rubric for evaluation if available
      const rubric = await this.rubricRepository.findOne({ 
        where: { name: `${topic}_rubric` },
      });
  
      // Generate prompt for LLM
      const prompt = this.buildQuestionPrompt(
        topic, 
        difficulty, 
        previousQuestions,
        rubric?.criteria_json
      );
  
      // Call LLM service
      const result = await this.openAIService.generateText(prompt);
  
      // Parse and save question
      const question = this.parseQuestionResult(result);
      const savedQuestion = await this.questionRepository.save({
        interview: { id: interviewId },
        question_text: question.text,
        difficulty,
        expected_answer: question.expectedAnswer,
      });
  
      return {
        questionId: savedQuestion.id,
        questionText: savedQuestion.question_text,
        expectedAnswerCriteria: question.expectedAnswerCriteria,
      };
    }
  
    async evaluateResponse(evaluateResponseDto: EvaluateResponseDto) {
      const { interviewId, questionId, candidateResponseText } = evaluateResponseDto;
  
      // Get question and interview context
      const question = await this.questionRepository.findOne({ 
        where: { id: questionId },
        relations: ['interview'],
      });
  
      if (!question || question.interview.id !== interviewId) {
        throw new BadRequestException('Question not found for this interview');
      }
  
      // Get rubric for evaluation
      const rubric = await this.rubricRepository.findOne({ 
        where: { name: `${question.interview.topic}_rubric` },
      });
  
      // Generate evaluation prompt
      const prompt = this.buildEvaluationPrompt(
        question.questionText,
        candidateResponseText,
        question.expectedAnswer,
        rubric?.criteria_json,
      );
  
      // Call LLM service
      const evaluationResult = await this.openAIService.generateText(prompt);
  
      // Parse evaluation
      const evaluation = this.parseEvaluationResult(evaluationResult);
  
      // Save response
      const response = await this.responseRepository.save({
        question: { id: questionId },
        candidate: { id: question.interview.candidate_id },
        response_text: candidateResponseText,
        ai_evaluation_score: evaluation.score,
        ai_feedback_json: evaluation.feedback,
      });
  
      return {
        responseId: response.id,
        score: evaluation.score,
        feedbackText: evaluation.feedback.feedback,
        breakdown: evaluation.feedback.criteria,
      };
    }
  
    async transcribeAudio(audioChunk: string, language: string) {
      // Call STT service
      return this.openAIService.transcribeAudio(audioChunk, language);
    }
  
    async initAvatarSession(initAvatarSessionDto: InitAvatarSessionDto) {
      const { avatarId, voiceSettings } = initAvatarSessionDto;
  
      // Initialize avatar session with provider
      const session = await this.heygenService.createSession({
        avatarId,
        voiceSettings,
      });
  
      return {
        avatarSessionId: session.sessionId,
        webRtcConnectionDetails: session.connectionDetails,
      };
    }
  
    async sendAvatarText(sendAvatarTextDto: SendAvatarTextDto) {
      const { avatarSessionId, text } = sendAvatarTextDto;
  
      // Send text to avatar service
      return this.heygenService.sendText(avatarSessionId, text);
    }
  
    private buildQuestionPrompt(
      topic: string,
      difficulty: number,
      previousQuestions: string[] = [],
      rubricCriteria?: any,
    ): string {
      // Build sophisticated prompt for question generation
      let prompt = `You are a technical interviewer assessing a candidate for a ${topic} position.
  Generate a technical question at difficulty level ${difficulty}/10.`;
  
      if (previousQuestions.length > 0) {
        prompt += `\n\nPreviously asked questions (avoid repetition):\n${previousQuestions.join('\n')}`;
      }
  
      if (rubricCriteria) {
        prompt += `\n\nUse these evaluation criteria:\n${JSON.stringify(rubricCriteria)}`;
      }
  
      prompt += `\n\nReturn JSON format with:
  - "question": The question text
  - "expected_answer": Key points expected in a good answer
  - "evaluation_criteria": Specific criteria to evaluate the response`;
  
      return prompt;
    }
  
    private buildEvaluationPrompt(
      question: string,
      response: string,
      expectedAnswer?: string,
      rubricCriteria?: any,
    ): string {
      // Build sophisticated prompt for response evaluation
      let prompt = `Evaluate this interview response based on the question and criteria.
  Question: ${question}
  Response: ${response}`;
  
      if (expectedAnswer) {
        prompt += `\n\nExpected key points: ${expectedAnswer}`;
      }
  
      if (rubricCriteria) {
        prompt += `\n\nEvaluation rubric:\n${JSON.stringify(rubricCriteria)}`;
      }
  
      prompt += `\n\nReturn JSON format with:
  - "score": Overall score 0-100
  - "feedback": Summary feedback
  - "criteria": Array of criteria evaluations with:
    - "name": Criterion name
    - "score": 0-10
    - "feedback": Specific feedback for this criterion`;
  
      return prompt;
    }
  
    private parseQuestionResult(result: string): any {
      try {
        return JSON.parse(result);
      } catch (error) {
        this.logger.error('Failed to parse LLM question result', error);
        throw new BadRequestException('Failed to generate question');
      }
    }
  
    private parseEvaluationResult(result: string): any {
      try {
        return JSON.parse(result);
      } catch (error) {
        this.logger.error('Failed to parse LLM evaluation result', error);
        throw new BadRequestException('Failed to evaluate response');
      }
    }
  }