import { User } from '@a4pm-receitas/database'
import { CreateUserDto } from '../dtos/create-user.dto'

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>
  findByLogin(login: string): Promise<User | null>
  findById(id: number): Promise<User | null>
}

export const IUserRepository = Symbol('IUserRepository')
