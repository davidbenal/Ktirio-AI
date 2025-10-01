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
          <p v-if="message" class="text-gray-600 mb-4">
            {{ message }}
          </p>

          <div class="mb-4">
            <input
              ref="inputRef"
              v-model="inputValue"
              type="text"
              :placeholder="placeholder"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleConfirm"
              @keyup.escape="handleCancel"
            />
            <p v-if="error" class="text-red-600 text-sm mt-2">
              {{ error }}
            </p>
          </div>

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
              :disabled="!inputValue.trim()"
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
import { ref, watch, nextTick } from 'vue'

export default {
  name: 'InputModal',
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
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    initialValue: {
      type: String,
      default: ''
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
      default: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'
    },
    cancelButtonClass: {
      type: String,
      default: 'bg-gray-300 hover:bg-gray-400 text-gray-800'
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    validation: {
      type: Function,
      default: null
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const inputValue = ref(props.initialValue)
    const error = ref(null)
    const inputRef = ref(null)

    // Observa mudanças no modal para resetar valores
    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        inputValue.value = props.initialValue
        error.value = null
        // Foca no input após o modal abrir
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value.focus()
          }
        })
      }
    })

    const handleConfirm = () => {
      if (!inputValue.value.trim()) {
        return
      }

      if (props.validation) {
        const errorMessage = props.validation(inputValue.value)
        if (errorMessage) {
          error.value = errorMessage
          return
        }
      }

      emit('confirm', inputValue.value)
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      inputValue,
      error,
      inputRef,
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