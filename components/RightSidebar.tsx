
import React from 'react';
import { ChevronRightIcon } from './icons';

interface RightSidebarProps {
  history: string[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (image: string) => void;
  currentImage: string | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ history, isCollapsed, onToggleCollapse, onSelect, currentImage }) => {
    
  if (isCollapsed) {
    return (
        <aside className="bg-white border-l border-gray-200 flex flex-col items-center p-2 relative">
             <button onClick={onToggleCollapse} className="absolute top-1/2 -left-3.5 z-10 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100">
                <ChevronRightIcon className="w-4 h-4 text-gray-600 rotate-180"/>
            </button>
        </aside>
    )
  }
  
  const reversedHistory = [...history].reverse();

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col p-4 relative transition-all duration-300">
       <button onClick={onToggleCollapse} className="absolute top-1/2 -left-3.5 z-10 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100">
            <ChevronRightIcon className="w-4 h-4 text-gray-600"/>
        </button>
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-800">Histórico da Sessão</h2>
        <p className="text-xs text-gray-500">{history.length} versões disponíveis</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
        {reversedHistory.map((image, index) => {
          const originalIndex = history.length - 1 - index;
          const isActive = (originalIndex === 0 && currentImage === history[0]) || (currentImage === image);
          
          return (
            <div
              key={originalIndex}
              onClick={() => onSelect(image)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border ${
                isActive 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'hover:bg-gray-100 border-transparent hover:border-gray-300'
              }`}
            >
              <img src={image} alt={`Version ${originalIndex + 1}`} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-800">
                  {originalIndex === 0 ? 'Imagem Original' : `Versão ${originalIndex}`}
                </p>
                <p className="text-[10px] text-gray-500">19:39:31</p>
              </div>
              <div className="text-xs font-medium text-gray-400">v{originalIndex}</div>
            </div>
          )
        })}
      </div>
      <div className="text-xs text-gray-400 mt-4 border-t pt-2">
        <p>Versão atual: <span className="font-semibold text-gray-600">v{history.findIndex(h => h === currentImage)}</span></p>
        <p>Clique em uma versão para aplicá-la</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
