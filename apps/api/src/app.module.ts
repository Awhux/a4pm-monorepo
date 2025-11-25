import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { RecipesModule } from './modules/recipes/recipes.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),

    InfrastructureModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    RecipesModule,
  ],
  providers: [],
})
export class AppModule {}
