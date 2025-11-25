<template>
  <div 
    class="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
    @click="$emit('click')"
  >
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium text-gray-900 truncate">{{ title }}</h3>
      <div class="mt-2 text-sm text-gray-500 space-y-1">
        <p v-if="category" class="flex items-center">
          <span class="font-medium mr-1">Categoria:</span> {{ category }}
        </p>
        <div class="flex gap-4">
            <p v-if="prepTime">
                <span class="font-medium">Tempo:</span> {{ prepTime }} min
            </p>
            <p v-if="servings">
                <span class="font-medium">Porções:</span> {{ servings }}
            </p>
        </div>
        <p class="mt-2 text-xs text-gray-400 border-t pt-2">
            Por: {{ author }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  category?: string
  prepTime?: number
  servings?: number
  author?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

