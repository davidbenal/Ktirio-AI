import { useModalsStore } from '../stores/modals.js'

/**
 * Composable para modais de confirmação e entrada de dados
 */
export function useConfirmModal() {
  const modalsStore = useModalsStore()

  /**
   * Exibe modal de confirmação
   * @param {Object} options - Opções do modal
   * @returns {Promise<boolean>} - true se confirmado, false se cancelado
   */
  const confirm = (options) => {
    return new Promise((resolve) => {
      modalsStore.showConfirmModal({
        title: options.title || 'Confirmação',
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        confirmButtonClass: options.confirmButtonClass,
        cancelButtonClass: options.cancelButtonClass,
        showCancelButton: options.showCancelButton !== false,
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }

  /**
   * Exibe modal de alerta (só com botão OK)
   * @param {Object} options - Opções do modal
   */
  const showAlert = (options) => {
    modalsStore.showConfirmModal({
      title: options.title || 'Aviso',
      message: options.message,
      confirmText: options.confirmText || 'OK',
      confirmButtonClass: options.confirmButtonClass || 'bg-blue-600 hover:bg-blue-700 text-white',
      showCancelButton: false,
      onConfirm: () => {}
    })
  }

  /**
   * Modal específico para confirmação de exclusão
   * @param {string} itemName - Nome do item a ser excluído
   * @returns {Promise<boolean>}
   */
  const confirmDelete = (itemName) => {
    return confirm({
      title: 'Confirmar Exclusão',
      message: itemName
        ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
    })
  }

  /**
   * Modal de entrada de dados (prompt)
   * @param {Object} options - Opções do modal
   * @returns {Promise<string|null>} - Valor digitado ou null se cancelado
   */
  const prompt = (options) => {
    return new Promise((resolve) => {
      modalsStore.showInputModal({
        title: options.title || 'Digite um valor',
        message: options.message,
        placeholder: options.placeholder,
        initialValue: options.initialValue,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        confirmButtonClass: options.confirmButtonClass,
        cancelButtonClass: options.cancelButtonClass,
        showCancelButton: true,
        validation: options.validation,
        onConfirm: (value) => {
          resolve(value)
        },
        onCancel: () => {
          resolve(null)
        }
      })
    })
  }

  return {
    confirm,
    showAlert,
    confirmDelete,
    prompt
  }
}