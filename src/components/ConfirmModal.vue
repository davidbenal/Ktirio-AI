<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="handleCancel"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ title }}
          </h2>
          <p class="text-gray-600 mb-6">
            {{ message }}
          </p>

          <div class="flex justify-end space-x-3">
            <button
              v-if="showCancelButton"
              @click="handleCancel"
              :class="cancelButtonClass"
              class="px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="confirmButtonClass"
              class="px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    confirmButtonClass: {
      type: String,
      default: 'bg-red-600 hover:bg-red-700 text-white'
    },
    cancelButtonClass: {
      type: String,
      default: 'bg-gray-300 hover:bg-gray-400 text-gray-800'
    },
    showCancelButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const handleConfirm = () => {
      emit('confirm')
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      handleConfirm,
      handleCancel
    }
  }
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