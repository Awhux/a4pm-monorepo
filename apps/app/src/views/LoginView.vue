<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acesse sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            comece seu teste grátis de 14 dias
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <BaseInput
            id="login"
            label="Login"
            v-model="form.login"
            required
            placeholder="Seu login"
          />
          <BaseInput
            id="password"
            label="Senha"
            type="password"
            v-model="form.password"
            required
            placeholder="Sua senha"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {{ error }}
        </div>

        <div>
          <BaseButton type="submit">
            Entrar
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  login: '',
  password: '',
})

const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  try {
    await authStore.login(form)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Ocorreu um erro durante o login'
  }
}
</script>
