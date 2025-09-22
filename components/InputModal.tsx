import React, { useState, useEffect } from 'react';

interface InputModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
  validation?: (value: string) => string | null;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  title,
  message,
  placeholder = '',
  initialValue = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700 text-white',
  cancelButtonClass = 'bg-gray-300 hover:bg-gray-400 text-gray-800',
  showCancelButton = true,
  onConfirm,
  onCancel,
  validation,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
      setError(null);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (validation) {
      const errorMessage = validation(inputValue);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }
    onConfirm(inputValue);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape' && showCancelButton) {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {message && <p className="text-gray-600 mb-4">{message}</p>}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          autoFocus
        />

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          {showCancelButton && (
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${cancelButtonClass}`}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;