import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dtos/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.findByLogin(login)
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto.login, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: user.id, login: user.login }
    const token = this.jwtService.sign(payload)

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return {
      message: 'Logged in successfully',
      user,
    }
  }

  logout(response: Response) {
    response.clearCookie('access_token')
    return { message: 'Logged out successfully' }
  }

  async getProfile(id: number) {
    const user = await this.usersService.findById(id)
    if (!user) {
      return null
    }
    const { password, ...result } = user
    return result
  }
}
