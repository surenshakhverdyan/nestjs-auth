import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('sign-up (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        name: 'test',
        email: 'testing@email.com',
        password: '156354111',
      })
      .expect(201);
  });

  it('sign-in (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'test@email.com',
        password: '156354111',
      })
      .expect(200);
  });

  it('refresh-token (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set({
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjA1MjQ5ZjQwZTYxODgxYzYxODQ4YzkiLCJpYXQiOjE3MTE2MTMxMDIsImV4cCI6MTcxMjIxNzkwMn0.YMhFjgVDzIb6yb-8s9NL6c8pVuSXSG6Idfzw63ys3io',
      })
      .expect(200);
  });

  it('forgot-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({
        email: 'test@email.com',
      })
      .expect(200);
  });

  it('password-reset/:token (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(
        '/auth/password-reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjA1MjQ5ZjQwZTYxODgxYzYxODQ4YzkiLCJpYXQiOjE3MTE2MTMxMDIsImV4cCI6MTcxMjIxNzkwMn0.YMhFjgVDzIb6yb-8s9NL6c8pVuSXSG6Idfzw63ys3io',
      )
      .send({
        password: '156354111',
        passwordConfirm: '156354111',
      })
      .expect(200);
  });
});
