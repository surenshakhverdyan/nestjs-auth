import { Types } from 'mongoose';

export interface IPayload {
  sub: Types.ObjectId;
  iat?: Date;
  exp?: Date;
}
