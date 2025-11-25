import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../infrastructure/database/database.module'
import { PrismaUserRepository } from '../../infrastructure/database/repositories/prisma-users.repository'
import { IUserRepository } from './interfaces/user.repository.interface'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
