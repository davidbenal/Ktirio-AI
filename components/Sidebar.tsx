
import React, { useRef } from 'react';
import { CameraIcon, PlusIcon, ChevronLeftIcon, KtirioLogo } from './icons';
import ProjectDropdown from './ProjectDropdown';
import { Project, Folder } from '../types';

interface SidebarProps {
  project: Project;
  folders: Folder[];
  onImageUpload: (dataUrl: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  baseImage: string | null;
  objectImages: string[];
  onObjectImageUpload: (dataUrl: string) => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onShowHistory: () => void;
  onExport: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onBackToGallery: () => void;
  onDuplicateProject: () => void;
  onNewProjectFromVersion: () => void;
  onToggleFavorite: () => void;
  onToggleArchive: () => void;
  onMoveProject: (folderId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    project,
    folders,
    onImageUpload,
    prompt,
    onPromptChange,
    onGenerate,
    isLoading,
    baseImage,
    objectImages,
    onObjectImageUpload,
    projectName,
    onProjectNameChange,
    onShowHistory,
    onExport,
    isCollapsed,
    onToggleCollapse,
    onBackToGallery,
    onDuplicateProject,
    onNewProjectFromVersion,
    onToggleFavorite,
    onToggleArchive,
    onMoveProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleObjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onObjectImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      event.target.value = ''; // Reset file input
    }
  };

  const triggerObjectFileUpload = () => {
    objectFileInputRef.current?.click();
  };


  if (isCollapsed) {
    return (
        <aside className="bg-white border-r border-gray-200 flex flex-col items-center p-2 relative">
             <button onClick={onToggleCollapse} className="absolute top-1/2 -right-3.5 z-10 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100">
                <ChevronLeftIcon className="w-4 h-4 text-gray-600 rotate-180"/>
            </button>
            <div className="p-2">
                <KtirioLogo />
            </div>
        </aside>
    )
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col p-4 space-y-6 relative transition-all duration-300">
        <button onClick={onToggleCollapse} className="absolute top-1/2 -right-3.5 z-10 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100">
            <ChevronLeftIcon className="w-4 h-4 text-gray-600"/>
        </button>
        <div className="flex items-center justify-between">
            <KtirioLogo />
            <button onClick={onBackToGallery} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <ChevronLeftIcon className="w-5 h-5"/>
            </button>
        </div>
      
      {/* Project Management */}
      <ProjectDropdown 
        project={project}
        folders={folders}
        onShowHistory={onShowHistory} 
        onExport={onExport}
        onDuplicateProject={onDuplicateProject}
        onNewProjectFromVersion={onNewProjectFromVersion}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onMoveProject={onMoveProject}
      >
        <input 
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="font-semibold text-sm bg-transparent focus:outline-none focus:ring-0 border-none p-0 w-full"
        />
      </ProjectDropdown>

      {/* Files */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">Arquivos no projeto</h3>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Foto do ambiente</h4>
            {baseImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img src={baseImage} alt="Ambiente" className="w-full h-full object-cover" />
                    <button onClick={triggerFileUpload} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        Trocar foto
                    </button>
                </div>
            ) : (
                <div 
                    onClick={triggerFileUpload}
                    className="aspect-video bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors"
                >
                    <CameraIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-semibold">Enviar foto</span>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Composition */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">Composição da cena</h3>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Objetos inseridos</h4>
            <div className="flex items-center gap-2 flex-wrap">
                {objectImages.map((img, index) => (
                    <div key={index} className="relative h-12 w-12">
                        <img src={img} alt={`Object ${index + 1}`} className="h-full w-full object-cover rounded-lg"/>
                    </div>
                ))}
                <button onClick={triggerObjectFileUpload} className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors">
                    <PlusIcon className="w-6 h-6"/>
                </button>
                <input type="file" ref={objectFileInputRef} onChange={handleObjectFileChange} accept="image/*" className="hidden" />
            </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="flex-1 flex flex-col space-y-2 pb-4">
        <h3 className="text-sm font-semibold text-gray-500">Prompt da cena</h3>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Descreva a prompt da cena aqui... Ex: 'Adicione um sofá de veludo verde e uma mesa de centro de mármore.'"
          className="flex-1 w-full p-3 bg-gray-50 rounded-xl border border-gray-200 resize-none focus:ring-2 focus:ring-gray-800 focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !baseImage || !prompt}
        className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
            "Gerar imagem"
        )}
      </button>

    </aside>
  );
};

export default Sidebar;
