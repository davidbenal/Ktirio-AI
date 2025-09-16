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
    <div className="w-full h-screen bg-[#F7F7F8] p-4 flex flex-col gap-4">
        {/* Floating Header */}
        <header className="h-16 bg-white rounded-2xl shadow-lg flex-shrink-0 flex items-center px-6 justify-between z-10">
            <KtirioLogo className="text-2xl font-black tracking-wide" />
        </header>

        <div className="flex-grow flex gap-4 overflow-hidden">
            {/* Floating Sidebar */}
            <aside className="w-72 bg-white rounded-2xl shadow-lg p-4 flex flex-col flex-shrink-0">
                <div className="relative mb-4">
                    <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input 
                        type="text" 
                        placeholder="Pesquisar" 
                        className="w-full bg-gray-100/70 border border-gray-200/80 rounded-md pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
                    />
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul>
                        {specialFolders.map(folder => (
                            <li key={folder.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolderId(folder.id); }} className={`flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${selectedFolderId === folder.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    <folder.icon className="w-5 h-5"/>
                                    <span>{folder.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2 px-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pastas</h3>
                            <button onClick={handleCreateFolder} className="text-gray-400 hover:text-gray-800 transition-colors">
                                <FolderPlusIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        <ul>
                            {customFolders.map(folder => (
                                <li key={folder.id}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolderId(folder.id); }} className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedFolderId === folder.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <FolderIcon className="w-5 h-5"/>
                                        <span>{folder.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Floating Main Content */}
            <main className="flex-1 bg-white rounded-2xl shadow-lg p-8 overflow-y-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {specialFolders.find(f => f.id === selectedFolderId)?.name || folders.find(f => f.id === selectedFolderId)?.name || 'Galeria'}
                    </h1>
                    <button 
                        onClick={onNewProject} 
                        className="bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-900 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        <span>Novo projeto</span>
                    </button>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map(project => (
                        <div 
                            key={project.id} 
                            className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:border-gray-800/50 transition-all group relative"
                        >
                            <div onClick={() => onSelectProject(project.id)} className="cursor-pointer">
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    {project.history.length > 0 ? (
                                        <img src={project.history[project.history.length - 1]} alt={project.name} className="w-full h-full object-cover"/>
                                    ) : project.baseImage ? (
                                        <img src={project.baseImage} alt={project.name} className="w-full h-full object-cover"/>
                                    ) : (
                                    <GalleryIcon className="w-12 h-12 text-gray-300"/>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm truncate text-gray-800">{project.name}</h3>
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
                                        className="opacity-0 group-hover:opacity-100 bg-black/50 text-white hover:bg-black/70 p-1.5 rounded-full transition-opacity"
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
    </div>
  );
};

export default ProjectGallery;