import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalsStore = defineStore('modals', () => {
  // State
  const isConfirmOpen = ref(false)
  const isInputOpen = ref(false)
  const confirmConfig = ref(null)
  const inputConfig = ref(null)

  // Actions
  const showConfirmModal = (config) => {
    confirmConfig.value = config
    isConfirmOpen.value = true
  }

  const showInputModal = (config) => {
    inputConfig.value = config
    isInputOpen.value = true
  }

  const hideModal = () => {
    isConfirmOpen.value = false
    isInputOpen.value = false
    setTimeout(() => {
      confirmConfig.value = null
      inputConfig.value = null
    }, 200)
  }

  const handleConfirm = async () => {
    if (confirmConfig.value?.onConfirm) {
      try {
        await confirmConfig.value.onConfirm()
      } catch (error) {
        console.error('Error in modal confirm action:', error)
      }
    }
    hideModal()
  }

  const handleCancel = () => {
    if (confirmConfig.value?.onCancel) {
      confirmConfig.value.onCancel()
    }
    hideModal()
  }

  const handleInputConfirm = async (value) => {
    if (inputConfig.value?.onConfirm) {
      try {
        await inputConfig.value.onConfirm(value)
      } catch (error) {
        console.error('Error in input modal confirm action:', error)
      }
    }
    hideModal()
  }

  const handleInputCancel = () => {
    if (inputConfig.value?.onCancel) {
      inputConfig.value.onCancel()
    }
    hideModal()
  }

  return {
    // State
    isConfirmOpen,
    isInputOpen,
    confirmConfig,
    inputConfig,

    // Actions
    showConfirmModal,
    showInputModal,
    hideModal,
    handleConfirm,
    handleCancel,
    handleInputConfirm,
    handleInputCancel
  }
})