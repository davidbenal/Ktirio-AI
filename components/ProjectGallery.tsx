
import React, { useState, useRef, useEffect } from 'react';
import { Project, Folder } from '../types';
import { KtirioLogo, PlusIcon, SearchIcon, GalleryIcon, FolderIcon, FolderPlusIcon, EllipsisVerticalIcon, StarIcon, ArchiveIcon } from './icons';

interface ProjectGalleryProps {
    projects: Project[];
    folders: Folder[];
    onNewProject: () => void;
    onSelectProject: (projectId: string) => void;
    onDeleteProject: (projectId: string) => void;
    onRenameProject: (projectId: string, newName: string) => void;
    onDuplicateProject: (projectId: string) => void;
    onNewFolder: (folderName: string) => void;
    onToggleFavorite: (projectId: string) => void;
    onToggleArchive: (projectId: string) => void;
    onMoveProject: (projectId: string, folderId: string) => void;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ 
    projects, 
    folders, 
    onNewProject, 
    onSelectProject,
    onDeleteProject,
    onRenameProject,
    onDuplicateProject,
    onNewFolder,
    onToggleFavorite,
    onToggleArchive,
    onMoveProject,
}) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleRename = (project: Project) => {
        const newName = window.prompt("Digite o novo nome do projeto:", project.name);
        if (newName && newName.trim() !== "") {
            onRenameProject(project.id, newName.trim());
        }
        setOpenMenuId(null);
    };
    
    const handleCreateFolder = () => {
        const folderName = window.prompt("Digite o nome da nova pasta:");
        if (folderName && folderName.trim() !== "") {
            onNewFolder(folderName.trim());
        }
    };
    
    const filteredProjects = projects.filter(p => {
        if (selectedFolderId === 'all') return !p.isArchived;
        if (selectedFolderId === 'favorites') return p.isFavorite && !p.isArchived;
        if (selectedFolderId === 'archive') return p.isArchived;
        return p.folderId === selectedFolderId && !p.isArchived;
    });
    
    const specialFolders = [
        { id: 'all', name: 'Galeria', icon: GalleryIcon },
        { id: 'favorites', name: 'Favoritos', icon: StarIcon },
        { id: 'archive', name: 'Arquivados', icon: ArchiveIcon },
    ];
    
    const customFolders = folders.filter(f => !specialFolders.some(sf => sf.id === f.id));

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <KtirioLogo />
        </div>

        <div className="relative mb-4">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
                type="text" 
                placeholder="Pesquisar" 
                className="w-full bg-gray-100 border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
        </div>

        <nav className="flex-1">
            <ul>
                {specialFolders.map(folder => (
                     <li key={folder.id}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolderId(folder.id); }} className={`flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md ${selectedFolderId === folder.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                            <folder.icon className="w-5 h-5 text-gray-700"/>
                            <span>{folder.name}</span>
                        </a>
                    </li>
                ))}
            </ul>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pastas de projetos</h3>
                    <button onClick={handleCreateFolder} className="text-gray-400 hover:text-gray-700">
                        <FolderPlusIcon className="w-5 h-5"/>
                    </button>
                </div>
                <ul>
                    {customFolders.map(folder => (
                        <li key={folder.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolderId(folder.id); }} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${selectedFolderId === folder.id ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FolderIcon className="w-5 h-5"/>
                                <span>{folder.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
                {specialFolders.find(f => f.id === selectedFolderId)?.name || folders.find(f => f.id === selectedFolderId)?.name || 'Galeria'}
            </h1>
            <button 
                onClick={onNewProject} 
                className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900 flex items-center justify-center gap-2"
            >
                <PlusIcon className="w-5 h-5"/>
                <span>Novo projeto</span>
            </button>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
                <div 
                    key={project.id} 
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-800 transition-all group relative"
                >
                    <div onClick={() => onSelectProject(project.id)} className="cursor-pointer">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            {project.history.length > 0 ? (
                                <img src={project.history[project.history.length - 1]} alt={project.name} className="w-full h-full object-cover"/>
                            ) : project.baseImage ? (
                                <img src={project.baseImage} alt={project.name} className="w-full h-full object-cover"/>
                            ) : (
                            <GalleryIcon className="w-12 h-12 text-gray-400"/>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                            <p className="text-xs text-gray-500">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                     {/* Options button and menu */}
                    <div className="absolute bottom-3 right-3">
                        <div className="relative" ref={openMenuId === project.id ? menuRef : null}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === project.id ? null : project.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 bg-black/40 text-white hover:bg-black/60 p-1.5 rounded-md transition-opacity"
                                aria-label="Project options"
                            >
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                            {openMenuId === project.id && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                                    <button onClick={(e) => { e.stopPropagation(); onSelectProject(project.id); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Abrir editor</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRename(project); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Renomear</button>
                                    <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">{project.isFavorite ? 'Desfavoritar' : 'Favoritar'}</button>
                                    <button onClick={(e) => { e.stopPropagation(); console.log('move'); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Mover para pasta</button>
                                    <button onClick={(e) => { e.stopPropagation(); onDuplicateProject(project.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Duplicar projeto</button>
                                    <div className="my-1 h-px bg-gray-100"></div>
                                    <button onClick={(e) => { e.stopPropagation(); onToggleArchive(project.id); setOpenMenuId(null);}} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">{project.isArchived ? 'Restaurar' : 'Arquivar'}</button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectGallery;
