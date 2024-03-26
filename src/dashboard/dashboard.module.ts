import { Module } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
