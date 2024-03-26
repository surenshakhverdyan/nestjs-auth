import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from 'src/token/token.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.header('refreshToken');

    if (!token) throw new UnauthorizedException();

    this.tokenService.verify(token);

    return true;
  }
}
