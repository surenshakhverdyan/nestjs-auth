import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from 'src/schemas';
import { CreateUserDto } from './dto';
import { IUser } from './interfaces';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userModel.create(dto);

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
      throw new HttpException(error.message, 500);
    }
  }

  response(_user: User, token?: string, refreshToken?: string): IUser {
    const user = {
      id: _user._id,
      name: _user.name,
      email: _user.email,
      authToken: token,
      refreshToken,
    };

    return user;
  }

  async update(dto: UpdateUserDto, sub: Types.ObjectId): Promise<boolean> {
    try {
      await this.userModel.findByIdAndUpdate(
        new Types.ObjectId(sub),
        {
          $set: dto,
        },
        { new: true },
      );

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
