import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('dashboard (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard')
      .set({
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjA1MjQ5ZjQwZTYxODgxYzYxODQ4YzkiLCJpYXQiOjE3MTE2MTMxMDIsImV4cCI6MTcxMjIxNzkwMn0.YMhFjgVDzIb6yb-8s9NL6c8pVuSXSG6Idfzw63ys3io',
      })
      .expect(200)
      .expect('Hello from dashboard');
  });
});
