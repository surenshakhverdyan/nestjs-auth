import { Module } from '@nestjs/common';

import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [TokenModule, UserModule, AuthModule, DashboardModule],
})
export class AppModule {}
