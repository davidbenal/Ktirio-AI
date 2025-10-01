<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl text-center">
          <!-- Spinner de loading -->
          <div class="flex justify-center mb-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ title || 'Carregando...' }}
          </h3>

          <p v-if="message" class="text-gray-600 text-sm">
            {{ message }}
          </p>

          <!-- Barra de progresso opcional -->
          <div v-if="showProgress && progress !== null" class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ progress.toFixed(0) }}%</p>
          </div>

          <!-- Botão de cancelar opcional -->
          <button
            v-if="showCancel"
            @click="$emit('cancel')"
            class="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'LoadingModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Carregando...'
    },
    message: {
      type: String,
      default: ''
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: null
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel']
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>