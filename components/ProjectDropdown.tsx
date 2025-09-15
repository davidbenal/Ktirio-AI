
import React, { useState, useRef, useEffect } from 'react';
import { GridMenuIcon, ChevronDownIcon, HistoryIcon, DownloadIcon, StarIcon, FolderIcon, DuplicateIcon, NewFileIcon, ArchiveIcon, ChevronLeftIcon } from './icons';
import { Project, Folder } from '../types';

interface ProjectDropdownProps {
  children: React.ReactNode;
  project: Project;
  folders: Folder[];
  onShowHistory: () => void;
  onExport: () => void;
  onDuplicateProject: () => void;
  onNewProjectFromVersion: () => void;
  onToggleFavorite: () => void;
  onToggleArchive: () => void;
  onMoveProject: (folderId: string) => void;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({ 
    children, 
    project, 
    folders,
    onShowHistory, 
    onExport,
    onDuplicateProject,
    onNewProjectFromVersion,
    onToggleFavorite,
    onToggleArchive,
    onMoveProject
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'move'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(prev => !prev);
    setView('main'); // Reset to main view whenever opened
  }

  const mainMenuItems = [
    { label: 'Ver o histórico completo', icon: HistoryIcon, action: onShowHistory },
    { label: 'Exportar', icon: DownloadIcon, action: onExport },
    { label: project.isFavorite ? 'Remover dos favoritos' : 'Adicionar a favoritos', icon: StarIcon, action: onToggleFavorite },
    { label: 'Mover projeto de pasta', icon: FolderIcon, action: () => setView('move') },
    { label: 'Duplicar', icon: DuplicateIcon, action: onDuplicateProject },
    { label: project.isArchived ? 'Restaurar projeto' : 'Arquivar projeto', icon: ArchiveIcon, action: onToggleArchive },
    { label: 'Criar novo projeto a partir de versão ativa', icon: NewFileIcon, action: onNewProjectFromVersion },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <button onClick={handleOpen} className="text-gray-600 hover:bg-gray-100 p-1 rounded-md">
            <GridMenuIcon />
        </button>
        <div className="flex-1">{children}</div>
        <button onClick={handleOpen} className="text-gray-600 hover:bg-gray-100 p-1 rounded-md">
            <ChevronDownIcon />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
          {view === 'main' && mainMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                if(item.action !== (() => setView('move'))) setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <item.icon className="w-4 h-4 text-gray-500" />
              <span>{item.label}</span>
            </button>
          ))}
          {view === 'move' && (
            <div>
                <button onClick={() => setView('main')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                    <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
                    <span>Voltar</span>
                </button>
                <div className="my-1 h-px bg-gray-100"></div>
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => {
                            onMoveProject(folder.id);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                         <FolderIcon className="w-4 h-4 text-gray-500" />
                         <span>{folder.name}</span>
                    </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;
