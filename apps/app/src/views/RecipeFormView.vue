<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
          {{ isEditing ? 'Editar Receita' : 'Nova Receita' }}
        </h3>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <BaseInput
            id="name"
            label="Nome da Receita"
            v-model="form.name"
            required
            placeholder="Ex: Bolo de Cenoura"
          />

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              id="category" 
              v-model="form.categoryId" 
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>Selecione uma categoria</option>
              <option v-for="category in recipesStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <BaseInput
              id="preparationTime"
              label="Tempo de Preparo (min)"
              type="number"
              v-model.number="form.preparationTime"
              min="1"
            />

            <BaseInput
              id="servings"
              label="Porções"
              type="number"
              v-model.number="form.servings"
              min="1"
            />
          </div>

          <div>
            <label for="ingredients" class="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
            <textarea 
              id="ingredients" 
              v-model="form.ingredients" 
              rows="4"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Liste os ingredientes..."
            ></textarea>
          </div>

          <div>
            <label for="preparationMethod" class="block text-sm font-medium text-gray-700 mb-1">Modo de Preparo</label>
            <textarea 
              id="preparationMethod" 
              v-model="form.preparationMethod" 
              required 
              rows="6"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Descreva o passo a passo..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="router.back()"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <BaseButton type="submit" class="w-auto">
              Salvar Receita
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useRecipesStore } from '../stores/recipes'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()

const isEditing = computed(() => route.params.id !== undefined)

const form = reactive({
  name: '',
  categoryId: null as number | null,
  preparationTime: null as number | null,
  servings: null as number | null,
  ingredients: '',
  preparationMethod: '',
})

onMounted(async () => {
  await recipesStore.fetchCategories()
  if (isEditing.value) {
    const id = Number(route.params.id)
    const recipe = await recipesStore.fetchRecipe(id)
    if (recipe) {
      form.name = recipe.name
      form.categoryId = recipe.categoryId
      form.preparationTime = recipe.preparationTime
      form.servings = recipe.servings
      form.ingredients = recipe.ingredients
      form.preparationMethod = recipe.preparationMethod
    }
  }
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
        await recipesStore.updateRecipe(Number(route.params.id), form)
    } else {
        await recipesStore.createRecipe(form)
    }
    router.push('/')
  } catch (error: any) {
      alert(error.message || 'Erro ao salvar receita')
  }
}
</script>
