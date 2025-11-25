<template>
  <DefaultLayout>
    <div class="px-4 py-6 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Receitas</h2>
        <router-link to="/recipes/create">
          <BaseButton class="w-auto">
            Nova Receita
          </BaseButton>
        </router-link>
      </div>

      <div class="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Buscar</label>
          <input 
            type="text" 
            id="search" 
            v-model="searchQuery" 
            placeholder="Buscar receitas..."
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            @input="debouncedSearch" 
          />
        </div>
        <div class="flex items-center">
          <input 
            id="mine" 
            type="checkbox" 
            v-model="showMineOnly"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
          />
          <label for="mine" class="ml-2 block text-sm text-gray-900">
            Minhas Receitas
          </label>
        </div>
      </div>

      <div v-if="recipesStore.loading" class="text-center py-12">
        <p class="text-gray-500">Carregando receitas...</p>
      </div>

      <div v-else-if="recipesStore.recipes.length === 0" class="text-center py-12">
        <p class="text-gray-500">Nenhuma receita encontrada.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RecipeCard
            v-for="recipe in recipesStore.recipes" 
            :key="recipe.id"
            :title="recipe.name"
            :category="recipe.category?.name"
            :prep-time="recipe.preparationTime"
            :servings="recipe.servings"
            :author="recipe.user?.name || recipe.user?.login"
            @click="router.push(`/recipes/${recipe.id}`)"
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useRecipesStore } from '../stores/recipes'
import RecipeCard from '../components/RecipeCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const recipesStore = useRecipesStore()

const searchQuery = ref('')
const showMineOnly = ref(false)

const fetchRecipes = () => {
  recipesStore.fetchRecipes(searchQuery.value, showMineOnly.value)
}

let timeout: ReturnType<typeof setTimeout>

const debouncedSearch = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchRecipes()
  }, 300)
}

watch(showMineOnly, () => {
  fetchRecipes()
})

onMounted(() => {
  fetchRecipes()
})
</script>
