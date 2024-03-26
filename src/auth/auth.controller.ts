import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { IUser } from 'src/user/interfaces';
import { SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sing-up')
  signUp(dto: CreateUserDto): Promise<IUser> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sing-in')
  signIn(dto: SignInDto): Promise<IUser> {
    return this.authService.signIn(dto);
  }
}
