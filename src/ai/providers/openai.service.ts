import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('OpenAI API error', error);
      throw error;
    }
  }

  async transcribeAudio(audioChunk: string, language: string): Promise<string> {
    try {
      // In a real implementation, you would send the audio data to Whisper API
      // This is a simplified example
      return 'Mock transcribed text from audio';
    } catch (error) {
      this.logger.error('Audio transcription error', error);
      throw error;
    }
  }
}

