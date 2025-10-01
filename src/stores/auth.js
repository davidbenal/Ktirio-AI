import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  registerWithEmail,
  loginWithEmail,
  loginAnonymously,
  logout,
  onAuthStateChange,
  getCurrentUser
} from '../services/authService.js'

/**
 * Pinia store for user authentication
 *
 * Manages:
 * - User authentication state
 * - Login/logout/register methods
 * - Auth state persistence
 * - Loading states
 */
export const useAuthStore = defineStore('auth', () => {
  // ========== STATE ==========
  const user = ref(null)
  const isLoading = ref(true)
  const authInitialized = ref(false)

  // ========== COMPUTED ==========
  const isAuthenticated = computed(() => !!user.value)
  const isAnonymous = computed(() => user.value?.isAnonymous || false)
  const userEmail = computed(() => user.value?.email || '')
  const userDisplayName = computed(() => user.value?.displayName || user.value?.email || 'Usuário')
  const userId = computed(() => user.value?.uid || null)

  // ========== ACTIONS ==========

  /**
   * Initialize auth state monitoring
   */
  const initializeAuth = () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChange((firebaseUser) => {
        user.value = firebaseUser
        isLoading.value = false

        if (!authInitialized.value) {
          authInitialized.value = true
          resolve()
        }
      })

      // Store unsubscribe function for cleanup
      return unsubscribe
    })
  }

  /**
   * Register new user with email and password
   */
  const register = async (email, password, displayName = '') => {
    isLoading.value = true

    try {
      const result = await registerWithEmail(email, password, displayName)

      if (result.success) {
        user.value = result.user
      }

      return result
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    isLoading.value = true

    try {
      const result = await loginWithEmail(email, password)

      if (result.success) {
        user.value = result.user
      }

      return result
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login anonymously (for testing/guest access)
   */
  const loginAsGuest = async () => {
    isLoading.value = true

    try {
      const result = await loginAnonymously()

      if (result.success) {
        user.value = result.user
      }

      return result
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout current user
   */
  const signOut = async () => {
    isLoading.value = true

    try {
      const result = await logout()

      if (result.success) {
        user.value = null
      }

      return result
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get current user data
   */
  const refreshUser = () => {
    user.value = getCurrentUser()
  }

  return {
    // State
    user,
    isLoading,
    authInitialized,

    // Computed
    isAuthenticated,
    isAnonymous,
    userEmail,
    userDisplayName,
    userId,

    // Actions
    initializeAuth,
    register,
    login,
    loginAsGuest,
    signOut,
    refreshUser
  }
})