// src/rtc/rtc.gateway.ts
import { 
    WebSocketGateway, 
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { UseGuards } from '@nestjs/common';
  import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
  import { RtcService } from './rtc.service';
  import { Interview } from '../interviews/entities/interview.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  @WebSocketGateway({
    namespace: '/ws/interview',
    cors: {
      origin: '*',
    },
  })
  @UseGuards(WsJwtGuard)
  export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(
      private readonly rtcService: RtcService,
      @InjectRepository(Interview)
      private readonly interviewRepository: Repository<Interview>,
    ) {}
  
    async handleConnection(client: Socket) {
      const interviewId = client.handshake.query.interviewId as string;
      const userId = client.handshake.auth.userId;
      
      if (!interviewId || !userId) {
        client.disconnect(true);
        return;
      }
  
      // Verify user has access to this interview
      const interview = await this.interviewRepository.findOne({
        where: { id: interviewId },
        relations: ['candidate', 'interviewer'],
      });
  
      if (!interview) {
        client.disconnect(true);
        return;
      }
  
      if (
        userId !== interview.candidate.id 
      ) {
        client.disconnect(true);
        return;
      }
  
      // Join room
      client.join(interviewId);
      console.log(`Client ${userId} connected to interview ${interviewId}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('client-audio-stream')
    handleAudioStream(
      @MessageBody() data: { interviewId: string; audioChunk: any },
      @ConnectedSocket() client: Socket,
    ) {
      // Broadcast to other clients in the same interview
      client.to(data.interviewId).emit('server-audio-stream', data.audioChunk);
    }
  
    @SubscribeMessage('client-text-input')
    handleTextInput(
      @MessageBody() data: { interviewId: string; text: string },
      @ConnectedSocket() client: Socket,
    ) {
      // Process text input (e.g., send to AI service)
      client.to(data.interviewId).emit('server-text-transcript', {
        text: data.text,
        isFinal: true,
      });
    }
  
    @SubscribeMessage('client-join-interview')
    handleJoinInterview(
      @MessageBody() data: { interviewId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      // Notify other participants
      client.to(data.interviewId).emit('server-participant-joined', {
        userId: data.userId,
      });
    }
  }