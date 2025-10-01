<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <!-- Loading quando Clerk não carregou -->
      <div v-if="!isLoaded" class="space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p class="text-gray-600 text-sm">Carregando...</p>
      </div>

      <!-- Redirecionamento baseado no status de auth -->
      <div v-else class="space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p class="text-gray-600 text-sm">Redirecionando...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref } from 'vue'
import { useAuth } from '@clerk/vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const { isLoaded, isSignedIn } = useAuth()
    const router = useRouter()
    const hasRedirected = ref(false)

    // Observar mudanças no status de carregamento
    watch(
      [isLoaded, isSignedIn],
      ([loaded, signedIn]) => {
        if (loaded && !hasRedirected.value) {
          // Clerk carregou, verificar autenticação
          hasRedirected.value = true

          // Usar setTimeout para evitar loops de navegação
          setTimeout(() => {
            if (signedIn) {
              router.replace('/gallery')
            } else {
              router.replace('/sign-in')
            }
          }, 100)
        }
      },
      { immediate: true }
    )

    return {
      isLoaded,
      isSignedIn
    }
  }
}
</script>