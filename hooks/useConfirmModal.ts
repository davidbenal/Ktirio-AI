import { useCallback } from 'react';
import { useModal } from '../contexts/ModalContext';

interface ConfirmModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
}

interface PromptModalOptions {
  title?: string;
  message?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  validation?: (value: string) => string | null;
}

export const useConfirmModal = () => {
  const { showConfirmModal, showInputModal } = useModal();

  const confirm = useCallback(
    (options: ConfirmModalOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        showConfirmModal({
          title: options.title || 'Confirmação',
          message: options.message,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          confirmButtonClass: options.confirmButtonClass,
          cancelButtonClass: options.cancelButtonClass,
          showCancelButton: options.showCancelButton !== false,
          onConfirm: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
    },
    [showConfirmModal]
  );

  const showAlert = useCallback(
    (options: Omit<ConfirmModalOptions, 'showCancelButton'>) => {
      showConfirmModal({
        title: options.title || 'Aviso',
        message: options.message,
        confirmText: options.confirmText || 'OK',
        confirmButtonClass: options.confirmButtonClass || 'bg-blue-600 hover:bg-blue-700 text-white',
        showCancelButton: false,
        onConfirm: () => {},
      });
    },
    [showConfirmModal]
  );

  const confirmDelete = useCallback(
    (itemName?: string): Promise<boolean> => {
      return confirm({
        title: 'Confirmar Exclusão',
        message: itemName
          ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
          : 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
      });
    },
    [confirm]
  );

  const prompt = useCallback(
    (options: PromptModalOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        showInputModal({
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
          onConfirm: (value: string) => {
            resolve(value);
          },
          onCancel: () => {
            resolve(null);
          },
        });
      });
    },
    [showInputModal]
  );

  return { confirm, showAlert, confirmDelete, prompt };
};

export default useConfirmModal;