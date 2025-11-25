import { Category } from '@a4pm-receitas/database'
import { Injectable } from '@nestjs/common'
import { ICategoryRepository } from '../../../modules/categories/interfaces/category.repository.interface'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany()
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    })
  }
}
