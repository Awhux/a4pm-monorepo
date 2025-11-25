import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp, TestContext } from './utils/setup';

describe('Auth & Users E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const context: TestContext = await createTestingApp();
    app = context.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - register a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        login: 'authuser',
        password: 'password123',
        name: 'Auth User',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.login).toBe('authuser');
        expect(res.body.id).toBeDefined();
      });
  });

  it('/auth/login (POST) - login with registered user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'authuser',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
        expect(cookieArray.some((c: string) => c.startsWith('access_token='))).toBe(true);
      });
  });

  it('/auth/me (GET) - get profile', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'authuser', password: 'password123' });

    const cookie = loginRes.headers['set-cookie'];

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.login).toBe('authuser');
      });
  });
});

