import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './auth'
import { ref } from 'vue'

const mockUseApi = vi.fn()
vi.mock('../utils/api', () => ({
  default: (url: string) => mockUseApi(url)
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('login success', async () => {
    const user = { id: 1, login: 'test' }
    const mockPost = vi.fn().mockReturnThis()
    const mockJson = vi.fn().mockResolvedValue({
      data: ref({ user }),
      error: ref(null)
    })

    mockUseApi.mockReturnValue({
      post: mockPost,
      json: mockJson
    })

    const store = useAuthStore()
    await store.login({ login: 'test', password: 'password' })

    expect(store.user).toEqual(user)
    expect(store.isAuthenticated).toBe(true)
    expect(mockUseApi).toHaveBeenCalledWith('/v1/auth/login')
  })

  it('logout success', async () => {
    const mockPost = vi.fn().mockResolvedValue({})

    mockUseApi.mockReturnValue({
      post: mockPost
    })

    const store = useAuthStore()
    store.user = { id: 1, login: 'test', name: 'Test' }
    store.isAuthenticated = true

    await store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})

