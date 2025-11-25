import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { RecipesService } from './recipes.service'
import { IRecipeRepository } from './interfaces/recipe.repository.interface'
import { CreateRecipeDto } from './dtos/create-recipe.dto'
import { UpdateRecipeDto } from './dtos/update-recipe.dto'

describe('RecipesService', () => {
  let service: RecipesService
  let recipeRepository: IRecipeRepository

  const mockRecipeRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: IRecipeRepository,
          useValue: mockRecipeRepository,
        },
      ],
    }).compile()

    service = module.get<RecipesService>(RecipesService)
    recipeRepository = module.get<IRecipeRepository>(IRecipeRepository)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a recipe', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'Test Recipe',
        preparationMethod: 'Test Method',
        ingredients: 'Test Ingredients',
        preparationTime: 30,
        servings: 4,
        categoryId: 1,
      }
      const userId = 1
      const createdRecipe = { id: 1, userId, ...createRecipeDto }

      mockRecipeRepository.create.mockResolvedValue(createdRecipe)

      const result = await service.create(userId, createRecipeDto)
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        name: 'Test Recipe',
      }))
      expect(mockRecipeRepository.create).toHaveBeenCalledWith(userId, createRecipeDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const recipes = [{ id: 1, name: 'Test Recipe' }]
      mockRecipeRepository.findAll.mockResolvedValue(recipes)

      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Test Recipe')
    })
  })

  describe('findOne', () => {
    it('should return a recipe by id', async () => {
      const recipe = { id: 1, name: 'Test Recipe' }
      mockRecipeRepository.findById.mockResolvedValue(recipe)

      const result = await service.findOne(1)
      expect(result.name).toBe('Test Recipe')
    })

    it('should throw NotFoundException if recipe not found', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    const updateRecipeDto: UpdateRecipeDto = { name: 'Updated Title' }
    const userId = 1
    const recipeId = 1

    it('should update a recipe', async () => {
      const existingRecipe = { id: recipeId, userId, name: 'Old Title' }
      const updatedRecipe = { id: recipeId, userId, name: 'Updated Title' }

      mockRecipeRepository.findById.mockResolvedValue(existingRecipe)
      mockRecipeRepository.update.mockResolvedValue(updatedRecipe)

      const result = await service.update(userId, recipeId, updateRecipeDto)
      expect(result.name).toBe('Updated Title')
    })

    it('should throw NotFoundException if recipe not found', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null)

      await expect(service.update(userId, recipeId, updateRecipeDto)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw ForbiddenException if user does not own the recipe', async () => {
      const existingRecipe = { id: recipeId, userId: 2, name: 'Old Title' }
      mockRecipeRepository.findById.mockResolvedValue(existingRecipe)

      await expect(service.update(userId, recipeId, updateRecipeDto)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })

  describe('remove', () => {
    const userId = 1
    const recipeId = 1

    it('should remove a recipe', async () => {
      const existingRecipe = { id: recipeId, userId, name: 'Title' }
      mockRecipeRepository.findById.mockResolvedValue(existingRecipe)

      await service.remove(userId, recipeId)
      expect(mockRecipeRepository.delete).toHaveBeenCalledWith(recipeId)
    })

    it('should throw NotFoundException if recipe not found', async () => {
      mockRecipeRepository.findById.mockResolvedValue(null)

      await expect(service.remove(userId, recipeId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user does not own the recipe', async () => {
      const existingRecipe = { id: recipeId, userId: 2, name: 'Title' }
      mockRecipeRepository.findById.mockResolvedValue(existingRecipe)

      await expect(service.remove(userId, recipeId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })
})

