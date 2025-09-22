import React, { useRef } from 'react';
import { CameraIcon, SparklesIcon, PencilIcon, ShareIcon } from './icons';

interface InfoCardProps {
  num: string;
  title: string;
  icon: React.ReactNode;
}

/**
 * Card informativo com ícone, número e título
 */
const InfoCard: React.FC<InfoCardProps> = ({ num, title, icon }) => (
  <div className="flex items-center gap-4 text-left p-4">
    <div className="bg-gray-100/80 p-3 rounded-lg text-gray-700">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-semibold">{num}</p>
      <p className="text-gray-800 text-sm font-medium">{title}</p>
    </div>
  </div>
);

interface WelcomeViewProps {
  onImageUpload: (dataUrl: string) => void;
}

/**
 * Tela de boas-vindas exibida quando não há imagem base
 * Permite upload de imagem e mostra guia de uso
 */
const WelcomeView: React.FC<WelcomeViewProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Processa arquivo selecionado e converte para data URL
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center flex-col text-center p-8 bg-gray-50/50">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800">O que vamos criar hoje?</h2>
        <p className="text-gray-600 mt-2">Comece enviando uma foto do ambiente que você deseja transformar.</p>

        {/* Guia de passos */}
        <div className="mt-8 w-full bg-white/50 border border-gray-200/80 rounded-2xl p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <InfoCard num="01" title="Envie a foto" icon={<CameraIcon className="h-7 w-7" />} />
            <InfoCard num="02" title="Decore e customize" icon={<SparklesIcon className="h-7 w-7" />} />
            <InfoCard num="03" title="Edite ou inclua" icon={<PencilIcon className="h-7 w-7" />} />
            <InfoCard num="04" title="Baixe e compartilhe" icon={<ShareIcon className="h-7 w-7" />} />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-8 flex gap-4 justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-transform hover:scale-105"
          >
            Upload de foto
          </button>
          {/* Placeholder for camera functionality */}
          <button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 border border-gray-200 transition-transform hover:scale-105">
            Tirar foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;