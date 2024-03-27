import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { IUser } from 'src/user/interfaces';
import { SignInDto } from './dto';
import { RefreshGuard } from 'src/guards';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: CreateUserDto): Promise<IUser> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() dto: SignInDto): Promise<IUser> {
    return this.authService.signIn(dto);
  }

  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(): string {
    return this.authService.refreshToken();
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @Patch('password-reset/:token')
  passwordReset(
    @Body() dto: UpdateUserDto,
    @Param('token') token: string,
  ): Promise<boolean> {
    return this.authService.passwordReset(dto, token);
  }
}
