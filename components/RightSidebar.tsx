
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon, EllipsisVerticalIcon, NewFileIcon } from './icons';

interface RightSidebarProps {
  history: string[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (image: string) => void;
  currentImage: string | null;
  onNewProjectFromVersion: (image: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ history, isCollapsed, onToggleCollapse, onSelect, currentImage, onNewProjectFromVersion }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  if (isCollapsed) {
    return null; // The component will be hidden entirely when collapsed for a cleaner look
  }
  
  const reversedHistory = [...history].reverse();

  return (
    <aside className="w-72 bg-white rounded-2xl shadow-lg flex flex-col p-4 relative transition-all duration-300">
       <button onClick={onToggleCollapse} className="absolute top-6 -left-[13px] z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-100 hover:scale-110 transition-transform">
            <ChevronRightIcon className="w-4 h-4 text-gray-600"/>
        </button>
      <div className="px-2 pt-2 mb-4">
        <h2 className="text-md font-bold text-gray-800">Histórico da Sessão</h2>
        <p className="text-xs text-gray-500">{history.length} versões disponíveis</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
        {reversedHistory.map((image, index) => {
          const originalIndex = history.length - 1 - index;
          const isActive = currentImage === image;
          
          return (
            <div
              key={originalIndex}
              onClick={() => onSelect(image)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border-2 group relative ${
                isActive 
                  ? 'bg-gray-100 border-gray-800' 
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <img src={image} alt={`Version ${originalIndex + 1}`} className="w-12 h-12 rounded-md object-cover border border-gray-200" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {originalIndex === 0 ? 'Imagem Original' : `Versão ${originalIndex}`}
                </p>
                <p className="text-[11px] text-gray-500">19:39:31</p>
              </div>
              <div className="text-xs font-medium text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full">v{originalIndex}</div>
              
               <div className="absolute top-1 right-1">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuIndex(openMenuIndex === originalIndex ? null : originalIndex);
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-white/50 text-gray-600 hover:bg-white p-1 rounded-full transition-opacity"
                 >
                    <EllipsisVerticalIcon className="w-4 h-4" />
                 </button>
                 {openMenuIndex === originalIndex && (
                    <div ref={menuRef} className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onNewProjectFromVersion(image);
                                setOpenMenuIndex(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        >
                            <NewFileIcon className="w-4 h-4 text-gray-500" />
                            <span>Criar projeto desta versão</span>
                        </button>
                    </div>
                 )}
               </div>

            </div>
          )
        })}
      </div>
       <div className="text-xs text-gray-400 mt-4 border-t border-gray-200/80 pt-3 px-2">
        <p>Clique em uma versão para visualizá-la no canvas principal.</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
