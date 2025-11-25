import { createFetch } from '@vueuse/core'

const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  options: {
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      }
      options.credentials = 'include'
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

export default useApi
