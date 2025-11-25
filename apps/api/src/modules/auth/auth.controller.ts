import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response)
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id)
  }
}
