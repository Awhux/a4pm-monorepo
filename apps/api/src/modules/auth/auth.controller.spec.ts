import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { LoginDto } from './dtos/login.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  }

  const mockResponse = {} as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should call authService.login', async () => {
      const loginDto: LoginDto = { login: 'test', password: 'password' }
      const expectedResult = { message: 'Logged in successfully', user: { id: 1, login: 'test' } }
      mockAuthService.login.mockResolvedValue(expectedResult)

      const result = await controller.login(loginDto, mockResponse)
      expect(authService.login).toHaveBeenCalledWith(loginDto, mockResponse)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('logout', () => {
    it('should call authService.logout', async () => {
      const expectedResult = { message: 'Logged out successfully' }
      mockAuthService.logout.mockReturnValue(expectedResult)

      const result = await controller.logout(mockResponse)
      expect(authService.logout).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: { id: 1, login: 'test' } }
      const expectedUser = { id: 1, login: 'test', name: 'Test User' }
      mockAuthService.getProfile.mockResolvedValue(expectedUser)

      const result = await controller.getProfile(req)
      expect(authService.getProfile).toHaveBeenCalledWith(req.user.id)
      expect(result).toEqual(expectedUser)
    })
  })
})

