// src/ai/ai.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Param,
    HttpCode,
    HttpStatus,
    Get,
  } from '@nestjs/common';
  import { AiService } from './ai.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GenerateQuestionDto } from './dto/generate-question.dto';
import { EvaluateResponseDto } from './dto/evaluate-response.dto';
import { InitAvatarSessionDto } from './dto/init-avatar-session.dto';
import { SendAvatarTextDto } from './dto/send-avatar-text.dto';
import { HeygenService } from './providers/heygen.service';
  
  @ApiTags('AI Services')
  @ApiBearerAuth()
  @Controller('ai')
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class AiController {
    constructor(private readonly aiService: AiService,
        private readonly heygenService: HeygenService
    ) {}
  
    @Post('generate-question')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate interview question using AI' })
    @ApiResponse({ status: 200, description: 'Question generated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async generateQuestion(@Body() generateQuestionDto: GenerateQuestionDto) {
      return this.aiService.generateQuestion(generateQuestionDto);
    }
  
    @Post('evaluate-response')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Evaluate candidate response using AI' })
    @ApiResponse({ status: 200, description: 'Response evaluated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async evaluateResponse(@Body() evaluateResponseDto: EvaluateResponseDto) {
      return this.aiService.evaluateResponse(evaluateResponseDto);
    }
  
    @Post('transcribe')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Transcribe audio to text using AI (Internal)' })
    @ApiResponse({ status: 200, description: 'Audio transcribed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async transcribeAudio(@Body() audioData: { audioChunk: string; language: string }) {
      return this.aiService.transcribeAudio(audioData.audioChunk, audioData.language);
    }
  
    @Post('init-avatar-session')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Initialize AI avatar session' })
    @ApiResponse({ status: 200, description: 'Avatar session initialized' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async initAvatarSession(@Body() initAvatarSessionDto: InitAvatarSessionDto) {
      return this.aiService.initAvatarSession(initAvatarSessionDto);
    }
  
    @Post('send-avatar-text')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send text to AI avatar for vocalization' })
    @ApiResponse({ status: 200, description: 'Text sent to avatar' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async sendAvatarText(@Body() sendAvatarTextDto: SendAvatarTextDto) {
      return this.aiService.sendAvatarText(sendAvatarTextDto);
    }

    @Get('generate-video')
    async generateVideo() {
      const result = await this.heygenService.generateVideo('Estoy funcionando');
      return {
        message: 'Video en proceso de generación',
        videoId: result.videoId,
        statusUrl: `https://api.heygen.com/v1/video/status?video_id=${result.videoId}`
      };
    }
    @Get('hello')
    async generateHelloVideo() {
      const result = await this.heygenService.generateHelloVideo();
      return {
        message: 'Video en proceso de generación',
        videoId: result.videoId,
        statusUrl: `https://api.heygen.com/v1/video/status?video_id=${result.videoId}`
      };
    }
    @Get('avatars')
    @ApiOperation({ summary: 'List available AI avatars' }) 
    async listAvatars() {
      return this.heygenService.listAvatars();
    }
  }