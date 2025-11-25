import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

describe('CategoriesController', () => {
  let controller: CategoriesController
  let categoriesService: CategoriesService

  const mockCategoriesService = {
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    categoriesService = module.get<CategoriesService>(CategoriesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should call categoriesService.findAll', async () => {
      const categories = [{ id: 1, name: 'Test', slug: 'test' }]
      mockCategoriesService.findAll.mockResolvedValue(categories)

      const result = await controller.findAll()
      expect(categoriesService.findAll).toHaveBeenCalled()
      expect(result).toEqual(categories)
    })
  })
})

