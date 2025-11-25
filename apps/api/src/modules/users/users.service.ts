import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserResponseDto } from './dtos/user-response.dto'
import { IUserRepository } from './interfaces/user.repository.interface'

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByLogin(
      createUserDto.login,
    )
    if (existingUser) {
      throw new ConflictException('User with this login already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return UserResponseDto.fromEntity(user)
  }

  async findByLogin(login: string) {
    return this.userRepository.findByLogin(login)
  }

  async findById(id: number) {
    return this.userRepository.findById(id)
  }
}
