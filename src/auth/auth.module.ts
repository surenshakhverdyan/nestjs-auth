import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [UserModule, TokenModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
