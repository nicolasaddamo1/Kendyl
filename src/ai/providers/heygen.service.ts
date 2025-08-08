import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'; // Añade axios para llamadas HTTP

@Injectable()
export class HeygenService {
    private readonly logger = new Logger(HeygenService.name);
    private readonly apiKey: string;
    private readonly apiBaseUrl = 'https://api.heygen.com/v2'; 
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('HEYGEN_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY is not configured');
    }
  }

  async generateVideo(text: string): Promise<{ videoId: string }> {
    try {
        const avatarId = "Abigail_expressive_2024112501"; // Usa el avatar_id de tu lista
        const voiceId = 'wb0o0UmF8eXRpfCcgprl'; 

      const response = await axios.post(
        `${this.apiBaseUrl}/video/generate`,
        {
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: avatarId,
                scale: 1,
                avatar_style: 'normal',
                offset: { x: 0, y: 0 }
              },
              voice: {
                type: 'text',
                voice_id: voiceId,
                input_text: text,
                speed: 1.0,
                pitch: 0
              },
              background: {
                type: 'color',
                value: '#f6f6fc' 
              }
            }
          ],
          dimension: {
            width: 1280,
            height: 720
          }
        },
        {
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      return {
        videoId: response.data.video_id
      };
    } catch (error) {
      this.logger.error('Error generating video', error.response?.data || error.message);
      throw new Error('Failed to generate video');
    }
  }

  async generateHelloVideo() {
    try {
      const response = await axios.post(
        "https://api.heygen.com/v2/video/generate",
        {
          video_inputs: [{
            character: {
              type: "avatar",
              avatar_id: "Abigail_expressive_2024112501",
              avatar_style: "normal"
            },
            voice: {
              type: "text",
              voice_id: "1bd001e7e50f421d891986aad5158bc8", // Voice por defecto
              input_text: "Estoy funcionando",
              speed: 1.0
            },
            background: {
              type: "color",
              value: "#f6f6fc"
            }
          }],
          dimension: { width: 1280, height: 720 }
        },
        {
          headers: {
            "X-Api-Key": this.apiKey,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("Respuesta COMPLETA de Heygen:", response.data); // ← Añade esto
  
      if (!response.data.video_id) {
        throw new Error("Heygen no devolvió un video_id");
      }
  
      return {
        videoId: response.data.video_id,
        statusUrl: `https://api.heygen.com/v1/video/status?video_id=${response.data.video_id}`
      };
    } catch (error) {
      console.error("Error completo:", error.response?.data || error.message);
      throw error;
    }
  }

  async createSession(options: {
    avatarId: string;
    voiceSettings: any;
  }): Promise<{ sessionId: string; connectionDetails: any }> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/real-time/sessions`,
        {
          avatar: {
            avatar_id: options.avatarId,
          },
          voice: {
            voice_id: options.voiceSettings.voiceId,
            speed: options.voiceSettings.speed || 1.0,
            pitch: options.voiceSettings.pitch || 1.0,
          },
        },
        {
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        sessionId: response.data.data.session_id,
        connectionDetails: response.data.data, 
      };
    } catch (error) {
      this.logger.error('Heygen session creation error', error.response?.data || error.message);
      throw new Error('Failed to create Heygen session');
    }
  }

  async sendText(sessionId: string, text: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiBaseUrl}/real-time/commands`,
        {
          session_id: sessionId,
          command: {
            type: 'text',
            text: text,
          },
        },
        {
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`Text sent to session ${sessionId}: "${text}"`);
    } catch (error) {
      this.logger.error('Heygen text sending error', error.response?.data || error.message);
      throw new Error('Failed to send text to Heygen');
    }
  }
  async listAvatars(): Promise<any> {
    const response = await axios.get('https://api.heygen.com/v2/avatars', {
      headers: {
        'X-Api-Key': this.apiKey,
        'accept': 'application/json'
      }
    });
    return response.data.data.avatars; // Retorna array de avatares
  }
}