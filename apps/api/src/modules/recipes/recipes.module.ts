import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../infrastructure/database/database.module'
import { PrismaRecipeRepository } from '../../infrastructure/database/repositories/prisma-recipes.repository'
import { IRecipeRepository } from './interfaces/recipe.repository.interface'
import { RecipesController } from './recipes.controller'
import { RecipesService } from './recipes.service'

@Module({
  imports: [DatabaseModule],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: IRecipeRepository,
      useClass: PrismaRecipeRepository,
    },
  ],
  exports: [RecipesService],
})
export class RecipesModule {}
