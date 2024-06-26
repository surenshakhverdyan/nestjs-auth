import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { IPayload } from './interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: IPayload): string {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });

    return token;
  }

  signRefresh(payload: IPayload): string {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    return token;
  }

  verify(token: string): IPayload {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return payload;
    } catch (error: any) {
      throw new UnauthorizedException();
    }
  }

  extractFromHeaders(req: Request): string | undefined {
    const [key, token] = req.headers.authorization?.split(' ') ?? [];

    return key === 'Bearer' ? token : undefined;
  }
}
