import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestingApp, TestContext } from './utils/setup';

describe('Recipes E2E', () => {
  let app: INestApplication;
  let cookie: string[];

  beforeAll(async () => {
    const context: TestContext = await createTestingApp();
    app = context.app;

    await request(app.getHttpServer())
      .post('/users')
      .send({
        login: 'recipeuser',
        password: 'password123',
        name: 'Recipe User',
      });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'recipeuser', password: 'password123' });

    cookie = Array.isArray(loginRes.headers['set-cookie'])
      ? loginRes.headers['set-cookie']
      : [loginRes.headers['set-cookie']];
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories (GET) - list categories', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('/recipes (POST) - create recipe', () => {
    return request(app.getHttpServer())
      .post('/recipes')
      .set('Cookie', cookie)
      .send({
        name: 'My E2E Recipe',
        preparationMethod: 'Mix and cook',
        ingredients: 'Water, Flour',
        preparationTime: 20,
        servings: 2,
        categoryId: 1,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('My E2E Recipe');
        expect(res.body.id).toBeDefined();
      });
  });

  it('/recipes (GET) - list recipes', () => {
    return request(app.getHttpServer())
      .get('/recipes')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('My E2E Recipe');
      });
  });

  it('/recipes/:id (GET) - get one recipe', async () => {
    const recipesRes = await request(app.getHttpServer())
      .get('/recipes')
      .set('Cookie', cookie);
    const recipeId = recipesRes.body[0].id;

    return request(app.getHttpServer())
      .get(`/recipes/${recipeId}`)
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('My E2E Recipe');
      });
  });

  it('/recipes/:id (PATCH) - update recipe', async () => {
    const recipesRes = await request(app.getHttpServer())
      .get('/recipes')
      .set('Cookie', cookie);
    const recipeId = recipesRes.body[0].id;

    return request(app.getHttpServer())
      .patch(`/recipes/${recipeId}`)
      .set('Cookie', cookie)
      .send({
        name: 'Updated E2E Recipe',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Updated E2E Recipe');
      });
  });

  it('/recipes/:id (DELETE) - delete recipe', async () => {
    const recipesRes = await request(app.getHttpServer())
      .get('/recipes')
      .set('Cookie', cookie);
    const recipeId = recipesRes.body[0].id;

    return request(app.getHttpServer())
      .delete(`/recipes/${recipeId}`)
      .set('Cookie', cookie)
      .expect(200);
  });
});

