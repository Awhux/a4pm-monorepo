import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRecipesStore } from './recipes'
import { ref } from 'vue'

const mockUseApi = vi.fn()
vi.mock('../utils/api', () => ({
  default: (url: string) => mockUseApi(url)
}))

describe('Recipes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchRecipes success', async () => {
    const recipes = [{ id: 1, name: 'Test' }]
    const mockGet = vi.fn().mockReturnThis()
    const mockJson = vi.fn().mockResolvedValue({
      data: ref(recipes),
      error: ref(null)
    })

    mockUseApi.mockReturnValue({
      get: mockGet,
      json: mockJson
    })

    const store = useRecipesStore()
    await store.fetchRecipes()

    expect(store.recipes).toEqual(recipes)
    expect(store.loading).toBe(false)
  })

  it('createRecipe success', async () => {
    const mockPost = vi.fn().mockReturnThis()
    const mockJson = vi.fn().mockResolvedValue({
      data: ref({}),
      error: ref(null)
    })

    mockUseApi.mockReturnValue({
      post: mockPost,
      json: mockJson
    })

    const store = useRecipesStore()
    await store.createRecipe({ name: 'New Recipe' })

    expect(mockUseApi).toHaveBeenCalledWith('/v1/recipes')
  })
})

