import { Test, TestingModule } from '@nestjs/testing'
import { RecipesController } from './recipes.controller'
import { RecipesService } from './recipes.service'
import { CreateRecipeDto } from './dtos/create-recipe.dto'
import { UpdateRecipeDto } from './dtos/update-recipe.dto'

describe('RecipesController', () => {
  let controller: RecipesController
  let recipesService: RecipesService

  const mockRecipesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile()

    controller = module.get<RecipesController>(RecipesController)
    recipesService = module.get<RecipesService>(RecipesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call recipesService.create', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'Test',
        preparationMethod: 'Desc',
        ingredients: 'Ing',
        preparationTime: 10,
        servings: 2,
        categoryId: 1,
      }
      const req = { user: { id: 1 } }
      
      await controller.create(req, createRecipeDto)
      expect(recipesService.create).toHaveBeenCalledWith(1, createRecipeDto)
    })
  })

  describe('findAll', () => {
    it('should call recipesService.findAll', async () => {
      const req = { user: { id: 1 } }
      await controller.findAll(req, 'query', 'true')
      expect(recipesService.findAll).toHaveBeenCalledWith(1, 'query')

      await controller.findAll(req, undefined, undefined)
      expect(recipesService.findAll).toHaveBeenCalledWith(undefined, undefined)
    })
  })

  describe('findOne', () => {
    it('should call recipesService.findOne', async () => {
      await controller.findOne(1)
      expect(recipesService.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should call recipesService.update', async () => {
      const updateRecipeDto: UpdateRecipeDto = { name: 'Updated' }
      const req = { user: { id: 1 } }
      await controller.update(req, 1, updateRecipeDto)
      expect(recipesService.update).toHaveBeenCalledWith(1, 1, updateRecipeDto)
    })
  })

  describe('remove', () => {
    it('should call recipesService.remove', async () => {
      const req = { user: { id: 1 } }
      await controller.remove(req, 1)
      expect(recipesService.remove).toHaveBeenCalledWith(1, 1)
    })
  })
})

