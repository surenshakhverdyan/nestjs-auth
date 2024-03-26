import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { IPayload } from './interfaces';

@Injectable()
export class PayloadService {
  generate(sub: Types.ObjectId): IPayload {
    const payload = { sub };

    return payload;
  }
}
