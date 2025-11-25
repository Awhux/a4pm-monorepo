import { Category } from '@a4pm-receitas/database'
import { ApiProperty } from '@nestjs/swagger'

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'Desserts' })
  name: string | null

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial)
  }

  static fromEntity(entity: Category): CategoryResponseDto {
    return new CategoryResponseDto({
      id: entity.id,
      name: entity.name,
    })
  }
}
