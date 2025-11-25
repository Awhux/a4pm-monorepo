import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { UsersService } from './users.service'
import { IUserRepository } from './interfaces/user.repository.interface'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dtos/create-user.dto'

jest.mock('bcrypt')

describe('UsersService', () => {
  let service: UsersService
  let userRepository: IUserRepository

  const mockUserRepository = {
    findByLogin: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userRepository = module.get<IUserRepository>(IUserRepository)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      login: 'testuser',
      password: 'password123',
      name: 'Test User',
    }

    it('should create a new user successfully', async () => {
      mockUserRepository.findByLogin.mockResolvedValue(null)
      ;(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt')
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword')
      
      const createdUser = {
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockUserRepository.create.mockResolvedValue(createdUser)

      const result = await service.create(createUserDto)

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        login: 'testuser',
        name: 'Test User',
      }))
      expect(result).not.toHaveProperty('password')
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith('testuser')
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt')
      expect(mockUserRepository.create).toHaveBeenCalled()
    })

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findByLogin.mockResolvedValue({ id: 1, login: 'testuser' })

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException)
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('findByLogin', () => {
    it('should return a user by login', async () => {
      const user = { id: 1, login: 'testuser' }
      mockUserRepository.findByLogin.mockResolvedValue(user)

      const result = await service.findByLogin('testuser')
      expect(result).toEqual(user)
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith('testuser')
    })
  })

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, login: 'testuser' }
      mockUserRepository.findById.mockResolvedValue(user)

      const result = await service.findById(1)
      expect(result).toEqual(user)
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1)
    })
  })
})

