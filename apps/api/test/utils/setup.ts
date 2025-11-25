import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { IUserRepository } from '../../src/modules/users/interfaces/user.repository.interface';
import { IRecipeRepository } from '../../src/modules/recipes/interfaces/recipe.repository.interface';
import { ICategoryRepository } from '../../src/modules/categories/interfaces/category.repository.interface';
import cookieParser from 'cookie-parser';

export interface TestContext {
  app: INestApplication;
  mockUsers: any[];
  mockRecipes: any[];
  mockCategories: any[];
}

export const createTestingApp = async (): Promise<TestContext> => {
  const mockUsers: any[] = [];
  const mockRecipes: any[] = [];
  const mockCategories: any[] = [
    { id: 1, name: 'Breakfast' },
    { id: 2, name: 'Lunch' },
  ];

  const mockUserRepository = {
    create: jest.fn().mockImplementation((data) => {
      const user = { id: mockUsers.length + 1, ...data, createdAt: new Date(), updatedAt: new Date() };
      mockUsers.push(user);
      return Promise.resolve(user);
    }),
    findByLogin: jest.fn().mockImplementation((login) => {
      return Promise.resolve(mockUsers.find(u => u.login === login) || null);
    }),
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockUsers.find(u => u.id === id) || null);
    }),
  };

  const mockRecipeRepository = {
    create: jest.fn().mockImplementation((userId, data) => {
      const recipe = {
        id: mockRecipes.length + 1,
        userId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: mockCategories.find(c => c.id === data.categoryId)
      };
      mockRecipes.push(recipe);
      return Promise.resolve(recipe);
    }),
    findAll: jest.fn().mockImplementation((userId, query) => {
      let results = [...mockRecipes];
      if (userId) results = results.filter(r => r.userId === userId);
      if (query) results = results.filter(r => r.name.includes(query));
      return Promise.resolve(results);
    }),
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockRecipes.find(r => r.id === id) || null);
    }),
    update: jest.fn().mockImplementation((id, data) => {
      const index = mockRecipes.findIndex(r => r.id === id);
      if (index === -1) return null;
      mockRecipes[index] = { ...mockRecipes[index], ...data };
      return Promise.resolve(mockRecipes[index]);
    }),
    delete: jest.fn().mockImplementation((id) => {
      const index = mockRecipes.findIndex(r => r.id === id);
      if (index > -1) mockRecipes.splice(index, 1);
      return Promise.resolve();
    }),
  };

  const mockCategoryRepository = {
    findAll: jest.fn().mockResolvedValue(mockCategories),
    findById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(mockCategories.find(c => c.id === id) || null);
    }),
  };

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(IUserRepository)
    .useValue(mockUserRepository)
    .overrideProvider(IRecipeRepository)
    .useValue(mockRecipeRepository)
    .overrideProvider(ICategoryRepository)
    .useValue(mockCategoryRepository)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());
  await app.init();

  return {
    app,
    mockUsers,
    mockRecipes,
    mockCategories,
  };
};

