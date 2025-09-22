import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import InputModal from '../components/InputModal';

interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface InputModalConfig {
  title: string;
  message?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
  onConfirm: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  validation?: (value: string) => string | null;
}

interface ModalContextType {
  showConfirmModal: (config: ModalConfig) => void;
  showInputModal: (config: InputModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [inputModalConfig, setInputModalConfig] = useState<InputModalConfig | null>(null);

  const showConfirmModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  }, []);

  const showInputModal = useCallback((config: InputModalConfig) => {
    setInputModalConfig(config);
    setIsInputOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setIsInputOpen(false);
    setTimeout(() => {
      setModalConfig(null);
      setInputModalConfig(null);
    }, 200);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (modalConfig?.onConfirm) {
      try {
        await modalConfig.onConfirm();
      } catch (error) {
        console.error('Error in modal confirm action:', error);
      }
    }
    hideModal();
  }, [modalConfig, hideModal]);

  const handleCancel = useCallback(() => {
    if (modalConfig?.onCancel) {
      modalConfig.onCancel();
    }
    hideModal();
  }, [modalConfig, hideModal]);

  const handleInputConfirm = useCallback(async (value: string) => {
    if (inputModalConfig?.onConfirm) {
      try {
        await inputModalConfig.onConfirm(value);
      } catch (error) {
        console.error('Error in input modal confirm action:', error);
      }
    }
    hideModal();
  }, [inputModalConfig, hideModal]);

  const handleInputCancel = useCallback(() => {
    if (inputModalConfig?.onCancel) {
      inputModalConfig.onCancel();
    }
    hideModal();
  }, [inputModalConfig, hideModal]);

  return (
    <ModalContext.Provider value={{ showConfirmModal, showInputModal, hideModal }}>
      {children}
      {modalConfig && (
        <ConfirmModal
          isOpen={isOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          confirmButtonClass={modalConfig.confirmButtonClass}
          cancelButtonClass={modalConfig.cancelButtonClass}
          showCancelButton={modalConfig.showCancelButton}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {inputModalConfig && (
        <InputModal
          isOpen={isInputOpen}
          title={inputModalConfig.title}
          message={inputModalConfig.message}
          placeholder={inputModalConfig.placeholder}
          initialValue={inputModalConfig.initialValue}
          confirmText={inputModalConfig.confirmText}
          cancelText={inputModalConfig.cancelText}
          confirmButtonClass={inputModalConfig.confirmButtonClass}
          cancelButtonClass={inputModalConfig.cancelButtonClass}
          showCancelButton={inputModalConfig.showCancelButton}
          onConfirm={handleInputConfirm}
          onCancel={handleInputCancel}
          validation={inputModalConfig.validation}
        />
      )}
    </ModalContext.Provider>
  );
};

export default ModalContext;