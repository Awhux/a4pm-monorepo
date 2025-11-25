import { Recipe } from '@a4pm-receitas/database'
import { CreateRecipeDto } from '../dtos/create-recipe.dto'
import { UpdateRecipeDto } from '../dtos/update-recipe.dto'

export interface IRecipeRepository {
  create(userId: number, data: CreateRecipeDto): Promise<Recipe>
  update(id: number, data: UpdateRecipeDto): Promise<Recipe>
  delete(id: number): Promise<Recipe>
  findById(id: number): Promise<Recipe | null>
  findAll(userId?: number, query?: string): Promise<Recipe[]>
}

export const IRecipeRepository = Symbol('IRecipeRepository')
