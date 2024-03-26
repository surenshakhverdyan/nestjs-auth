import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto';
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
    private userService: UserService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<IUser> {
    const _user = await this.userService.create(dto);
    const payload = this.payloadService.generate(_user._id);
    const token = this.tokenService.sign(payload);
    const user = this.userService.response(_user, token);

    return user;
  }

  async signIn(dto: SignInDto): Promise<IUser> {
    const _user = await this.userService.findOne(dto.email);

    if (!_user) throw new HttpException('User not found', 404);

    if (!(await bcrypt.compare(dto.password, _user.password)))
      throw new UnauthorizedException();

    const payload = this.payloadService.generate(_user._id);
    const token = this.tokenService.sign(payload);
    const user = this.userService.response(_user, token);

    return user;
  }
}
