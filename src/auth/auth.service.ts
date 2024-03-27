import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from 'src/user/dto';
import { IUser } from 'src/user/interfaces';
import { UserService } from 'src/user/user.service';
import { PayloadService } from 'src/token/payload.service';
import { TokenService } from 'src/token/token.service';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly payloadService: PayloadService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async signUp(dto: CreateUserDto): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashedPassword;
    const _user = await this.userService.create(dto);
    const payload = this.payloadService.generate(_user._id);
    const token = this.tokenService.sign(payload);
    const refreshToken = this.tokenService.signRefresh(payload);
    const user = this.userService.response(_user, token, refreshToken);

    return user;
  }

  async signIn(dto: SignInDto): Promise<IUser> {
    const _user = await this.userService.findOne(dto.email);

    if (!_user) throw new HttpException('User not found', 404);

    if (!(await bcrypt.compare(dto.password, _user.password)))
      throw new UnauthorizedException();

    const payload = this.payloadService.generate(_user._id);
    const token = this.tokenService.sign(payload);
    const refreshToken = this.tokenService.signRefresh(payload);
    const user = this.userService.response(_user, token, refreshToken);

    return user;
  }

  refreshToken(): string {
    const refreshToken = this.request.header('refreshToken');
    const { sub } = this.tokenService.decode(refreshToken);
    const payload = this.payloadService.generate(sub);
    const token = this.tokenService.sign(payload);

    return token;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const _user = await this.userService.findOne(email);

    if (!_user) throw new HttpException('User not found', 404);

    const payload = this.payloadService.generate(_user._id);
    const token = this.tokenService.sign(payload);
    const url = `${this.configService.get<string>('BASE_URL')}/password-reset/${token}`;

    await this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: email,
      subject: 'Password reset',
      text: url,
    });

    return true;
  }

  async passwordReset(dto: UpdateUserDto, token: string): Promise<boolean> {
    const { sub } = this.tokenService.decode(token);

    if (!dto.password && !dto.passwordConfirm)
      throw new HttpException('The passwords must not empty', 403);

    if (dto.password !== dto.passwordConfirm)
      throw new HttpException('The passwords must match', 403);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashedPassword;
    delete dto.passwordConfirm;

    return await this.userService.update(dto, sub);
  }
}
