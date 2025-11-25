import { defineStore } from 'pinia'
import useApi from '../utils/api'

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [] as any[],
    currentRecipe: null as any,
    categories: [] as any[],
    loading: false,
  }),
  actions: {
    async fetchRecipes(query?: string, mine?: boolean) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (query) params.append('query', query)
        if (mine) params.append('mine', 'true')

        const { data } = await useApi(`/v1/recipes?${params.toString()}`).get().json()
        this.recipes = data.value || []
      } finally {
        this.loading = false
      }
    },
    async fetchRecipe(id: number) {
      this.loading = true
      try {
        const { data } = await useApi(`/v1/recipes/${id}`).get().json()
        this.currentRecipe = data.value
        return data.value
      } finally {
        this.loading = false
      }
    },
    async fetchCategories() {
      const { data } = await useApi('/v1/categories').get().json()
      this.categories = data.value || []
    },
    async createRecipe(recipe: any) {
      const { error } = await useApi('/v1/recipes').post(recipe).json()
      if (error.value) throw error.value
    },
    async updateRecipe(id: number, recipe: any) {
      const { error } = await useApi(`/v1/recipes/${id}`).patch(recipe).json()
      if (error.value) throw error.value
    },
    async deleteRecipe(id: number) {
      const { error } = await useApi(`/v1/recipes/${id}`).delete().json()
      if (error.value) throw error.value
    },
  },
})
