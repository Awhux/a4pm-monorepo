import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateRecipeDto } from './dtos/create-recipe.dto'
import { RecipeResponseDto } from './dtos/recipe-response.dto'
import { UpdateRecipeDto } from './dtos/update-recipe.dto'
import { IRecipeRepository } from './interfaces/recipe.repository.interface'

@Injectable()
export class RecipesService {
  constructor(
    @Inject(IRecipeRepository)
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async create(
    userId: number,
    createRecipeDto: CreateRecipeDto,
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.create(userId, createRecipeDto)
    return RecipeResponseDto.fromEntity(recipe)
  }

  async findAll(userId?: number, query?: string): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeRepository.findAll(userId, query)
    return recipes.map(RecipeResponseDto.fromEntity)
  }

  async findOne(id: number): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id)
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`)
    }
    return RecipeResponseDto.fromEntity(recipe)
  }

  async update(
    userId: number,
    id: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findById(id)
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`)
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only update your own recipes')
    }

    const updatedRecipe = await this.recipeRepository.update(
      id,
      updateRecipeDto,
    )
    return RecipeResponseDto.fromEntity(updatedRecipe)
  }

  async remove(userId: number, id: number): Promise<void> {
    const recipe = await this.recipeRepository.findById(id)
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`)
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes')
    }

    await this.recipeRepository.delete(id)
  }
}
