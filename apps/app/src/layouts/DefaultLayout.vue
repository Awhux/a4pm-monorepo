<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow print:hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="shrink-0 flex items-center cursor-pointer" @click="router.push('/')">
              <h1 class="text-xl font-bold text-indigo-600">RecipeApp</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="authStore.user" class="text-gray-700">Olá, {{ authStore.user.name || authStore.user.login }}</span>
            <button @click="logout" class="text-gray-500 hover:text-gray-700">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
