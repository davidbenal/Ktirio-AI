<template>
  <div class="relative">
    <!-- User Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
    >
      <!-- User Avatar -->
      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {{ userInitials }}
      </div>

      <!-- User Info -->
      <div class="hidden sm:block text-left">
        <div class="text-sm font-medium text-gray-900">
          {{ displayName }}
        </div>
        <div v-if="!authStore.isAnonymous" class="text-xs text-gray-500">
          {{ authStore.userEmail }}
        </div>
      </div>

      <!-- Dropdown Arrow -->
      <svg
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isDropdownOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <!-- User Info (Mobile) -->
      <div class="sm:hidden px-4 py-2 border-b border-gray-100">
        <div class="text-sm font-medium text-gray-900">
          {{ displayName }}
        </div>
        <div v-if="!authStore.isAnonymous" class="text-xs text-gray-500">
          {{ authStore.userEmail }}
        </div>
      </div>

      <!-- Account Type -->
      <div class="px-4 py-2 border-b border-gray-100">
        <div class="flex items-center space-x-2">
          <div
            :class="[
              'w-2 h-2 rounded-full',
              authStore.isAnonymous ? 'bg-orange-400' : 'bg-green-400'
            ]"
          ></div>
          <span class="text-xs text-gray-600">
            {{ authStore.isAnonymous ? 'Visitante' : 'Conta registrada' }}
          </span>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <!-- Upgrade to Account (for anonymous users) -->
        <button
          v-if="authStore.isAnonymous"
          @click="handleUpgradeAccount"
          class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Criar conta</span>
          </div>
        </button>

        <!-- Profile/Settings -->
        <button
          v-if="!authStore.isAnonymous"
          @click="handleProfile"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Perfil</span>
          </div>
        </button>

        <!-- Projects Stats -->
        <div class="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          {{ projectsStore.projects.length }} projeto{{ projectsStore.projects.length !== 1 ? 's' : '' }}
        </div>

        <!-- Logout -->
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ authStore.isAnonymous ? 'Sair' : 'Logout' }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Click Outside Handler -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useProjectsStore } from '../stores/projects.js'

export default {
  name: 'UserProfile',
  emits: ['open-auth-modal'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const projectsStore = useProjectsStore()

    const isDropdownOpen = ref(false)

    const displayName = computed(() => {
      if (authStore.isAnonymous) {
        return 'Visitante'
      }
      return authStore.userDisplayName || 'Usuário'
    })

    const userInitials = computed(() => {
      const name = displayName.value
      if (name === 'Visitante') {
        return 'V'
      }

      const words = name.split(' ')
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    })

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const closeDropdown = () => {
      isDropdownOpen.value = false
    }

    const handleUpgradeAccount = () => {
      closeDropdown()
      emit('open-auth-modal')
    }

    const handleProfile = () => {
      closeDropdown()
      // TODO: Implement profile modal/page
      console.log('Open profile settings')
    }

    const handleLogout = async () => {
      closeDropdown()

      try {
        const result = await authStore.signOut()

        if (result.success) {
          // Reset projects store
          projectsStore.resetProjects()

          // Show success message or redirect
          console.log(result.message)
        } else {
          console.error('Logout error:', result.message)
        }
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Close dropdown on escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeDropdown()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })

    return {
      authStore,
      projectsStore,
      isDropdownOpen,
      displayName,
      userInitials,
      toggleDropdown,
      closeDropdown,
      handleUpgradeAccount,
      handleProfile,
      handleLogout
    }
  }
}
</script>