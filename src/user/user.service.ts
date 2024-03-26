import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from 'src/schemas';
import { CreateUserDto } from './dto';
import { IUser } from './interfaces';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      });

      return user;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });

      return user;
    } catch (error: any) {
      throw new HttpException('User not found', 404);
    }
  }

  response(_user: User): IUser {
    const user = {
      id: _user._id,
      name: _user.name,
      email: _user.email,
    };

    return user;
  }
}
