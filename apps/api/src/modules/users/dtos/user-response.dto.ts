import { User } from '@a4pm-receitas/database'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'John Doe' })
  name: string | null

  @ApiProperty({ example: 'johndoe' })
  login: string

  @Exclude()
  password?: string

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial)
  }

  static fromEntity(entity: User): UserResponseDto {
    return new UserResponseDto({
      id: entity.id,
      name: entity.name,
      login: entity.login,
    })
  }
}
