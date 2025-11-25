import { Recipe } from '@a4pm-receitas/database'
import { Injectable } from '@nestjs/common'
import { CreateRecipeDto } from '../../../modules/recipes/dtos/create-recipe.dto'
import { UpdateRecipeDto } from '../../../modules/recipes/dtos/update-recipe.dto'
import { IRecipeRepository } from '../../../modules/recipes/interfaces/recipe.repository.interface'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipeRepository implements IRecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: CreateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.create({
      data: {
        userId,
        categoryId: data.categoryId,
        name: data.name,
        preparationTime: data.preparationTime,
        servings: data.servings,
        preparationMethod: data.preparationMethod,
        ingredients: data.ingredients,
      },
      include: {
        user: true,
        category: true,
      },
    })
  }

  async update(id: number, data: UpdateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        user: true,
        category: true,
      },
    })
  }

  async delete(id: number): Promise<Recipe> {
    return this.prisma.recipe.delete({
      where: { id },
    })
  }

  async findById(id: number): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    })
  }

  async findAll(userId?: number, query?: string): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({
      where: {
        userId,
        name: query ? { contains: query } : undefined,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
