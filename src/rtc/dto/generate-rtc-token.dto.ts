// src/rtc/dto/generate-rtc-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsIn } from 'class-validator';

export class GenerateRtcTokenDto {
  @ApiProperty()
  @IsUUID()
  interviewId: string;

  @ApiProperty({ enum: ['publisher', 'subscriber'] })
  @IsString()
  @IsIn(['publisher', 'subscriber'])
  role: string;
}

// src/auth/guards/ws-jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard extends AuthGuard('ws-jwt') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    client.handshake.headers.authorization = `Bearer ${token}`;

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new WsException('Unauthorized: Invalid token');
    }
    return user;
  }
}