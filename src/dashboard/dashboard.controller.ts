import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  dashboard(): string {
    return this.dashboardService.dashboard();
  }
}
