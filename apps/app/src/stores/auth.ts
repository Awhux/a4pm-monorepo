import { defineStore } from 'pinia'
import useApi from '../utils/api'

interface User {
  id: number
  login: string
  name?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),
  actions: {
    async login(credentials: any) {
      const { error, data } = await useApi('/v1/auth/login').post(credentials).json()
      if (error.value) throw error.value
      this.user = data.value.user
      this.isAuthenticated = true
    },
    async register(userData: any) {
      const { error } = await useApi('/v1/users').post(userData).json()
      if (error.value) throw error.value
    },
    async logout() {
      await useApi('/v1/auth/logout').post()
      this.user = null
      this.isAuthenticated = false
    },
    async checkAuth() {
      try {
        const { error, data } = await useApi('/v1/auth/me').get().json()
        if (error.value) throw error.value
        this.user = data.value
        this.isAuthenticated = true
        return true
      } catch {
        this.user = null
        this.isAuthenticated = false
        return false
      }
    },
  },
})
