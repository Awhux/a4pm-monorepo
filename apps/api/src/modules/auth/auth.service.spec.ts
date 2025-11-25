import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService

  const mockUsersService = {
    findByLogin: jest.fn(),
    findById: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(),
  }

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return user data without password if validation succeeds', async () => {
      const user = { id: 1, login: 'test', password: 'hashedPassword' }
      mockUsersService.findByLogin.mockResolvedValue(user)
        ; (bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.validateUser('test', 'password')
      expect(result).toEqual({ id: 1, login: 'test' })
    })

    it('should return null if user not found', async () => {
      mockUsersService.findByLogin.mockResolvedValue(null)
      const result = await service.validateUser('test', 'password')
      expect(result).toBeNull()
    })

    it('should return null if password does not match', async () => {
      const user = { id: 1, login: 'test', password: 'hashedPassword' }
      mockUsersService.findByLogin.mockResolvedValue(user)
        ; (bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await service.validateUser('test', 'wrongPassword')
      expect(result).toBeNull()
    })
  })

  describe('login', () => {
    it('should return success message and user data on successful login', async () => {
      const loginDto = { login: 'test', password: 'password' }
      const user = { id: 1, login: 'test' }
      jest.spyOn(service, 'validateUser').mockResolvedValue(user)
      mockJwtService.sign.mockReturnValue('token')
      mockConfigService.get.mockReturnValue('development')

      const result = await service.login(loginDto, mockResponse)

      expect(result).toEqual({
        message: 'Logged in successfully',
        user,
      })
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
        })
      )
    })

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = { login: 'test', password: 'wrongPassword' }
      jest.spyOn(service, 'validateUser').mockResolvedValue(null)

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('logout', () => {
    it('should clear cookie and return success message', () => {
      const result = service.logout(mockResponse)
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token')
      expect(result).toEqual({ message: 'Logged out successfully' })
    })
  })

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const user = { id: 1, login: 'test', password: 'hashedPassword', name: 'Test' }
      mockUsersService.findById.mockResolvedValue(user)

      const result = await service.getProfile(1)
      expect(mockUsersService.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual({ id: 1, login: 'test', name: 'Test' })
    })

    it('should return null if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null)
      const result = await service.getProfile(1)
      expect(result).toBeNull()
    })
  })
})

