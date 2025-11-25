import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string
}
