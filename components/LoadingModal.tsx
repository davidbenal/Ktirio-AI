import React from 'react';
import { SpinnerIcon } from './icons';

/**
 * Modal de loading exibido durante processamento com IA
 */
const LoadingModal: React.FC = () => (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800/90 text-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
      <SpinnerIcon className="w-10 h-10 text-blue-400" />
      <h3 className="text-xl font-bold">Processando com IA...</h3>
      <p className="text-sm text-gray-300">Isso pode levar alguns segundos...</p>
    </div>
  </div>
);

export default LoadingModal;