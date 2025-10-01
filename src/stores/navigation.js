import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter()
  const route = useRoute()

  // State
  const currentScreen = ref('landing')

  // Getters
  const isOnLanding = computed(() => currentScreen.value === 'landing')
  const isOnGallery = computed(() => currentScreen.value === 'gallery')
  const isOnEditor = computed(() => currentScreen.value === 'editor')

  // Actions
  const updateCurrentScreen = () => {
    const path = route.path

    if (path === '/gallery') {
      currentScreen.value = 'gallery'
    } else if (path.startsWith('/editor')) {
      currentScreen.value = 'editor'
    } else {
      currentScreen.value = 'landing'
    }
  }

  const goToLanding = () => {
    router.push('/gallery')
    currentScreen.value = 'gallery'
  }

  const goToGallery = () => {
    router.push('/gallery')
    currentScreen.value = 'gallery'
  }

  const goToEditor = (projectId) => {
    if (projectId) {
      router.push(`/editor/${projectId}`)
    } else {
      router.push('/gallery')
    }
    currentScreen.value = 'editor'
  }

  const navigateToProject = (projectId) => {
    router.push(`/editor/${projectId}`)
    currentScreen.value = 'editor'
  }

  const getCurrentProjectId = () => {
    const path = route.path
    const match = path.match(/^\/editor\/(.+)$/)
    return match ? match[1] : null
  }

  const goBack = () => {
    router.back()
  }

  const pushByName = (name, params = {}) => {
    router.push({ name, params })
  }

  return {
    // State
    currentScreen,

    // Getters
    isOnLanding,
    isOnGallery,
    isOnEditor,

    // Actions
    updateCurrentScreen,
    goToLanding,
    goToGallery,
    goToEditor,
    navigateToProject,
    getCurrentProjectId,
    goBack,
    pushByName
  }
})