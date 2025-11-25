import { Inject, Injectable } from '@nestjs/common'
import { CategoryResponseDto } from './dtos/category-response.dto'
import { ICategoryRepository } from './interfaces/category.repository.interface'

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll()
    return categories.map(CategoryResponseDto.fromEntity)
  }

  async findById(id: number) {
    return this.categoryRepository.findById(id)
  }
}
