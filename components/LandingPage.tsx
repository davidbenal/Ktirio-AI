
import React from 'react';
import { CameraIcon, SparklesIcon, PencilIcon, ShareIcon } from './icons';

interface LandingPageProps {
  onStartProject: () => void;
}

const InfoCard: React.FC<{ num: string; title: string; icon: React.ReactNode }> = ({ num, title, icon }) => (
  <div className="flex flex-col items-start p-4 text-left">
    <div className="flex items-center gap-4">
      <div className="text-gray-400 font-light">{num}</div>
      <div className="bg-white/10 p-3 rounded-lg text-white">
        {icon}
      </div>
    </div>
    <p className="mt-4 text-white text-sm">{title}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartProject }) => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(https://picsum.photos/1920/1080?grayscale&blur=2)` }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
      
      <div className="relative z-20 flex flex-col items-center text-center text-white p-8 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Transforme fotos de ambientes em imagens irresistíveis que vendem
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
          Tão fácil como tirar uma foto: envie o ambiente, edite em minutos e tenha imagens prontas para encantar e vender.
        </p>

        <div className="mt-12 w-full bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <InfoCard num="01" title="Envie foto do ambiente" icon={<CameraIcon className="h-8 w-8" />} />
            <InfoCard num="02" title="Decore e customize do seu jeito" icon={<SparklesIcon className="h-8 w-8" />} />
            <InfoCard num="03" title="Edite ou inclua objetos no ambiente" icon={<PencilIcon className="h-8 w-8" />} />
            <InfoCard num="04" title="Baixe e compartilhe" icon={<ShareIcon className="h-8 w-8" />} />
          </div>
        </div>

        <button 
          onClick={onStartProject}
          className="mt-12 px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          Criar projeto
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
