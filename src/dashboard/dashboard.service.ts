import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  dashboard(): string {
    return 'Hello from dashboard';
  }
}
