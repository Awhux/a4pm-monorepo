import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserResponseDto } from './dtos/user-response.dto'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  const mockUsersService = {
    create: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call usersService.create', async () => {
      const createUserDto: CreateUserDto = {
        login: 'testuser',
        password: 'password123',
        name: 'Test User',
      }
      const expectedResult: UserResponseDto = {
        id: 1,
        login: 'testuser',
        name: 'Test User',
        // @ts-ignore
        createdAt: new Date(),
        // @ts-ignore
        updatedAt: new Date(),
      }

      mockUsersService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createUserDto)
      expect(usersService.create).toHaveBeenCalledWith(createUserDto)
      expect(result).toEqual(expectedResult)
    })
  })
})

