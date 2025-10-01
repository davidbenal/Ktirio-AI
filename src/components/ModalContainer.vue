<template>
  <!-- Modal de Confirmação -->
  <ConfirmModal
    :is-open="modalsStore.isConfirmOpen"
    :title="modalsStore.confirmConfig?.title || ''"
    :message="modalsStore.confirmConfig?.message || ''"
    :confirm-text="modalsStore.confirmConfig?.confirmText"
    :cancel-text="modalsStore.confirmConfig?.cancelText"
    :confirm-button-class="modalsStore.confirmConfig?.confirmButtonClass"
    :cancel-button-class="modalsStore.confirmConfig?.cancelButtonClass"
    :show-cancel-button="modalsStore.confirmConfig?.showCancelButton"
    @confirm="modalsStore.handleConfirm"
    @cancel="modalsStore.handleCancel"
  />

  <!-- Modal de Input -->
  <InputModal
    :is-open="modalsStore.isInputOpen"
    :title="modalsStore.inputConfig?.title || ''"
    :message="modalsStore.inputConfig?.message"
    :placeholder="modalsStore.inputConfig?.placeholder"
    :initial-value="modalsStore.inputConfig?.initialValue"
    :confirm-text="modalsStore.inputConfig?.confirmText"
    :cancel-text="modalsStore.inputConfig?.cancelText"
    :confirm-button-class="modalsStore.inputConfig?.confirmButtonClass"
    :cancel-button-class="modalsStore.inputConfig?.cancelButtonClass"
    :show-cancel-button="modalsStore.inputConfig?.showCancelButton"
    :validation="modalsStore.inputConfig?.validation"
    @confirm="modalsStore.handleInputConfirm"
    @cancel="modalsStore.handleInputCancel"
  />
</template>

<script>
import { useModalsStore } from '../stores/modals.js'
import ConfirmModal from './ConfirmModal.vue'
import InputModal from './InputModal.vue'

export default {
  name: 'ModalContainer',
  components: {
    ConfirmModal,
    InputModal
  },
  setup() {
    const modalsStore = useModalsStore()

    return {
      modalsStore
    }
  }
}
</script>