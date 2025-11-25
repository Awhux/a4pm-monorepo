<template>
  <DefaultLayout>
    <div class="print:bg-white print:absolute print:top-0 print:left-0 print:w-full print:z-50">
      <div v-if="recipesStore.currentRecipe" class="max-w-3xl mx-auto bg-white shadow sm:rounded-lg print:shadow-none print:max-w-none">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center print:hidden">
          <div>
              <button @click="router.back()" class="text-indigo-600 hover:text-indigo-900 mr-4">
                &larr; Voltar
              </button>
          </div>
          <div class="flex space-x-3">
            <button @click="printRecipe"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Imprimir
            </button>
            <template v-if="isOwner">
              <button @click="router.push(`/recipes/${recipesStore.currentRecipe.id}/edit`)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Editar
              </button>
              <button @click="deleteRecipe"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Excluir
              </button>
            </template>
          </div>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6 print:border-none print:p-8">
          <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ recipesStore.currentRecipe.name }}</h1>
              <p class="text-sm text-gray-500">Categoria: {{ recipesStore.currentRecipe.category?.name }}</p>
              <p class="text-sm text-gray-500">Por: {{ recipesStore.currentRecipe.user?.name || recipesStore.currentRecipe.user?.login }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8 text-center border-y border-gray-200 py-4">
              <div>
                  <span class="block text-sm font-medium text-gray-500">Tempo de Preparo</span>
                  <span class="block text-lg font-semibold text-gray-900">{{ recipesStore.currentRecipe.preparationTime }} min</span>
              </div>
              <div>
                  <span class="block text-sm font-medium text-gray-500">Porções</span>
                  <span class="block text-lg font-semibold text-gray-900">{{ recipesStore.currentRecipe.servings }}</span>
              </div>
          </div>

          <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Ingredientes</h2>
              <p class="whitespace-pre-line text-gray-700">{{ recipesStore.currentRecipe.ingredients }}</p>
          </div>

          <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Modo de Preparo</h2>
              <p class="whitespace-pre-line text-gray-700">{{ recipesStore.currentRecipe.preparationMethod }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="recipesStore.loading" class="text-center py-12">
          <p>Carregando...</p>
      </div>
      <div v-else class="text-center py-12">
          <p>Receita não encontrada.</p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useRecipesStore } from '../stores/recipes'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()
const authStore = useAuthStore()

const isOwner = computed(() => {
  return recipesStore.currentRecipe?.userId === authStore.user?.id
})

const printRecipe = () => {
  window.print()
}

const deleteRecipe = async () => {
  if (confirm('Tem certeza que deseja excluir esta receita?')) {
    await recipesStore.deleteRecipe(recipesStore.currentRecipe.id)
    router.push('/')
  }
}

onMounted(() => {
  recipesStore.fetchRecipe(Number(route.params.id))
})
</script>
