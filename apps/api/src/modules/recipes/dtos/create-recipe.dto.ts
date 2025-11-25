import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateRecipeDto {
  @ApiProperty({ example: 'Chocolate Cake' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId: number

  @ApiProperty({ example: 45, description: 'Preparation time in minutes' })
  @IsInt()
  @Min(1)
  @IsOptional()
  preparationTime?: number

  @ApiProperty({ example: 8, description: 'Number of servings' })
  @IsInt()
  @Min(1)
  @IsOptional()
  servings?: number

  @ApiProperty({ example: 'Mix ingredients and bake...' })
  @IsString()
  @IsNotEmpty()
  preparationMethod: string

  @ApiProperty({ example: 'Flour, Sugar, Cocoa...' })
  @IsString()
  @IsOptional()
  ingredients?: string
}
