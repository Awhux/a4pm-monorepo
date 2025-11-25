import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { ICategoryRepository } from './interfaces/category.repository.interface'

describe('CategoriesService', () => {
  let service: CategoriesService

  const mockCategoryRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: ICategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [{ id: 1, name: 'Test Category', slug: 'test-category' }]
      mockCategoryRepository.findAll.mockResolvedValue(categories)

      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Test Category')
    })
  })

  describe('findById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Test Category', slug: 'test-category' }
      mockCategoryRepository.findById.mockResolvedValue(category)

      const result = await service.findById(1)
      expect(result).toEqual(category)
    })
  })
})

