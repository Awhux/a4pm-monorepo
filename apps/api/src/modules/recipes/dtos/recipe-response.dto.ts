import { Recipe } from '@a4pm-receitas/database'
import { ApiProperty } from '@nestjs/swagger'
import { CategoryResponseDto } from '../../categories/dtos/category-response.dto'
import { UserResponseDto } from '../../users/dtos/user-response.dto'

export class RecipeResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 1 })
  userId: number

  @ApiProperty({ example: 1 })
  categoryId: number | null

  @ApiProperty({ example: 'Chocolate Cake' })
  name: string | null

  @ApiProperty({ example: 45 })
  preparationTime: number | null

  @ApiProperty({ example: 8 })
  servings: number | null

  @ApiProperty({ example: 'Mix ingredients and bake...' })
  preparationMethod: string

  @ApiProperty({ example: 'Flour, Sugar, Cocoa...' })
  ingredients: string | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty({ type: () => UserResponseDto })
  user?: UserResponseDto

  @ApiProperty({ type: () => CategoryResponseDto })
  category?: CategoryResponseDto

  constructor(partial: Partial<RecipeResponseDto>) {
    Object.assign(this, partial)
  }

  static fromEntity(
    entity: Recipe & { user?: any; category?: any },
  ): RecipeResponseDto {
    return new RecipeResponseDto({
      id: entity.id,
      userId: entity.userId,
      categoryId: entity.categoryId,
      name: entity.name,
      preparationTime: entity.preparationTime,
      servings: entity.servings,
      preparationMethod: entity.preparationMethod,
      ingredients: entity.ingredients,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user ? UserResponseDto.fromEntity(entity.user) : undefined,
      category: entity.category
        ? CategoryResponseDto.fromEntity(entity.category)
        : undefined,
    })
  }
}
