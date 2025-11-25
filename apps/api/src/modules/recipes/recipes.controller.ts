import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateRecipeDto } from './dtos/create-recipe.dto'
import { RecipeResponseDto } from './dtos/recipe-response.dto'
import { UpdateRecipeDto } from './dtos/update-recipe.dto'
import { RecipesService } from './recipes.service'

@ApiTags('Recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({
    status: 201,
    description: 'Recipe created successfully',
    type: RecipeResponseDto,
  })
  async create(
    @Request() req,
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.create(req.user.id, createRecipeDto)
  }

  @Get()
  @ApiOperation({ summary: 'List recipes' })
  @ApiQuery({ name: 'query', required: false, description: 'Search by name' })
  @ApiQuery({
    name: 'mine',
    required: false,
    type: Boolean,
    description: 'Filter by current user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recipes',
    type: [RecipeResponseDto],
  })
  async findAll(
    @Request() req,
    @Query('query') query?: string,
    @Query('mine') mine?: string,
  ): Promise<RecipeResponseDto[]> {
    const userId = mine === 'true' ? req.user.id : undefined
    return this.recipesService.findAll(userId, query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe details',
    type: RecipeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({
    status: 200,
    description: 'Recipe updated successfully',
    type: RecipeResponseDto,
  })
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.update(req.user.id, id, updateRecipeDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully' })
  async remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.recipesService.remove(req.user.id, id)
  }
}
