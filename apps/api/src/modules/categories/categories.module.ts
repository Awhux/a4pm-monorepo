import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../infrastructure/database/database.module'
import { PrismaCategoryRepository } from '../../infrastructure/database/repositories/prisma-categories.repository'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { ICategoryRepository } from './interfaces/category.repository.interface'

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: ICategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
