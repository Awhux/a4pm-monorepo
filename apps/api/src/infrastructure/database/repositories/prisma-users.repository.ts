import { User } from '@a4pm-receitas/database'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../../../modules/users/dtos/create-user.dto'
import { IUserRepository } from '../../../modules/users/interfaces/user.repository.interface'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        login: data.login,
        password: data.password,
      },
    })
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login },
    })
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }
}
