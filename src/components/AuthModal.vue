<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="handleBackdropClick"
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isLoginMode ? 'Entrar' : 'Criar Conta' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Error/Success Message -->
      <div v-if="message" :class="[
        'p-3 rounded-lg mb-4 text-sm',
        messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
      ]">
        {{ message }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Name Field (Register only) -->
        <div v-if="!isLoginMode" class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome (opcional)
          </label>
          <input
            id="name"
            v-model="formData.displayName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Seu nome"
          />
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="seu@email.com"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="••••••••"
            minlength="6"
          />
          <p v-if="!isLoginMode" class="text-xs text-gray-500 mt-1">
            Mínimo de 6 caracteres
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading || !formData.email || !formData.password"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </span>
          <span v-else>
            {{ isLoginMode ? 'Entrar' : 'Criar Conta' }}
          </span>
        </button>

        <!-- Mode Switch -->
        <div class="text-center mb-4">
          <button
            type="button"
            @click="toggleMode"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {{ isLoginMode ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="relative mb-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <!-- Guest Access -->
        <button
          type="button"
          @click="handleGuestLogin"
          :disabled="isLoading"
          class="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Continuar como visitante
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'AuthModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const authStore = useAuthStore()

    const isLoginMode = ref(true)
    const isLoading = ref(false)
    const message = ref('')
    const messageType = ref('error')

    const formData = ref({
      email: '',
      password: '',
      displayName: ''
    })

    // Reset form when modal opens/closes
    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        resetForm()
      }
    })

    const resetForm = () => {
      formData.value = {
        email: '',
        password: '',
        displayName: ''
      }
      message.value = ''
      isLoading.value = false
    }

    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value
      message.value = ''
    }

    const handleSubmit = async () => {
      if (isLoading.value) return

      isLoading.value = true
      message.value = ''

      try {
        let result

        if (isLoginMode.value) {
          result = await authStore.login(formData.value.email, formData.value.password)
        } else {
          result = await authStore.register(
            formData.value.email,
            formData.value.password,
            formData.value.displayName
          )
        }

        if (result.success) {
          messageType.value = 'success'
          message.value = result.message

          // Close modal after short delay
          setTimeout(() => {
            emit('success')
            emit('close')
          }, 1000)
        } else {
          messageType.value = 'error'
          message.value = result.message
        }
      } catch (error) {
        messageType.value = 'error'
        message.value = 'Erro inesperado. Tente novamente.'
        console.error('Auth error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleGuestLogin = async () => {
      if (isLoading.value) return

      isLoading.value = true
      message.value = ''

      try {
        const result = await authStore.loginAsGuest()

        if (result.success) {
          messageType.value = 'success'
          message.value = result.message

          // Close modal after short delay
          setTimeout(() => {
            emit('success')
            emit('close')
          }, 1000)
        } else {
          messageType.value = 'error'
          message.value = result.message
        }
      } catch (error) {
        messageType.value = 'error'
        message.value = 'Erro ao acessar como visitante.'
        console.error('Guest login error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleBackdropClick = () => {
      if (!isLoading.value) {
        emit('close')
      }
    }

    return {
      isLoginMode,
      isLoading,
      message,
      messageType,
      formData,
      toggleMode,
      handleSubmit,
      handleGuestLogin,
      handleBackdropClick
    }
  }
}
</script>