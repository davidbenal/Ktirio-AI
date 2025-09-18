import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon, PlusIcon, ChevronLeftIcon, KtirioLogo, KIcon, BackArrowIcon } from './icons';
import ProjectDropdown from './ProjectDropdown';
import { Project, Folder, ReferenceImage, ReferenceType } from '../types';

interface SidebarProps {
  project: Project;
  folders: Folder[];
  onImageUpload: (dataUrl: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  baseImage: string | null;
  objectImages: ReferenceImage[];
  onAddReferenceImage: (dataUrl: string) => void;
  onUpdateReferenceImage: (reference: ReferenceImage) => void;
  onDeleteReferenceImage: (id: string) => void;
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
    onAddReferenceImage,
    onUpdateReferenceImage,
    onDeleteReferenceImage,
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
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [suggestions, setSuggestions] = useState<ReferenceImage[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);


  useEffect(() => {
    if (showSuggestions) {
      setSuggestionIndex(0);
    }
  }, [suggestions, showSuggestions]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onPromptChange(value);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
    const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');

    if (lastSlashIndex > lastSpaceIndex) {
      const query = textBeforeCursor.substring(lastSlashIndex + 1);
      const filtered = objectImages.filter(img => img.name.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSuggestionClick(suggestions[suggestionIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: ReferenceImage) => {
    const textarea = promptTextareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = prompt.substring(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    const newPrompt = 
      prompt.substring(0, lastSlashIndex) + 
      `@[${suggestion.name}]` +
      prompt.substring(cursorPos);
    
    onPromptChange(newPrompt);
    setShowSuggestions(false);
    
    setTimeout(() => textarea.focus(), 0);
  };


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
          onAddReferenceImage(e.target.result as string);
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
        <aside className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-4 relative transition-all duration-300">
             <button onClick={onToggleCollapse} className="absolute top-6 -right-[13px] z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-100 hover:scale-110 transition-transform">
                <ChevronLeftIcon className="w-4 h-4 text-gray-600 rotate-180"/>
            </button>
            <div className="p-2">
                <KIcon className="text-2xl font-black tracking-wide"/>
            </div>
        </aside>
    )
  }

  return (
    <aside className="w-96 bg-white rounded-2xl shadow-lg flex flex-col p-4 space-y-4 relative transition-all duration-300">
        <button onClick={onToggleCollapse} className="absolute top-6 -right-[13px] z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-100 hover:scale-110 transition-transform">
            <ChevronLeftIcon className="w-4 h-4 text-gray-600"/>
        </button>
        <div className="flex items-center justify-between px-2 pt-2">
            <KtirioLogo className="text-2xl font-black tracking-wide"/>
            <button onClick={onBackToGallery} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <BackArrowIcon className="w-5 h-5"/>
            </button>
        </div>
      
      <div className="px-2">
        <ProjectDropdown 
          project={project} folders={folders} onShowHistory={onShowHistory} onExport={onExport}
          onDuplicateProject={onDuplicateProject} onNewProjectFromVersion={onNewProjectFromVersion}
          onToggleFavorite={onToggleFavorite} onToggleArchive={onToggleArchive} onMoveProject={onMoveProject}
        >
          <input 
              type="text" value={projectName} onChange={(e) => onProjectNameChange(e.target.value)}
              className="font-semibold text-md bg-transparent focus:outline-none focus:ring-0 border-none p-0 w-full"
          />
        </ProjectDropdown>
      </div>

      <div className="space-y-2 px-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Imagem do projeto</h3>
        <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-200/80">
            {baseImage ? (
                <div className="relative rounded-lg overflow-hidden group h-32">
                    <img src={baseImage} alt="Ambiente" className="w-full h-full object-cover" />
                    <button onClick={triggerFileUpload} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                        Trocar foto
                    </button>
                </div>
            ) : (
                <div onClick={triggerFileUpload} className="h-32 bg-gray-200/70 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors border border-gray-300/50">
                    <CameraIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-semibold">Enviar foto</span>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="space-y-2 px-2 flex-[2] flex flex-col min-h-0">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referências do projeto</h3>
        <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-200/80 flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-2">
                {objectImages.map((ref) => (
                    <ReferenceCard key={ref.id} reference={ref} onUpdate={onUpdateReferenceImage} onDelete={onDeleteReferenceImage} />
                ))}
                <button onClick={triggerObjectFileUpload} className="w-full h-12 bg-gray-200/70 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300/50">
                    <PlusIcon className="w-5 h-5"/>
                </button>
                <input type="file" ref={objectFileInputRef} onChange={handleObjectFileChange} accept="image/*" className="hidden" />
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2 px-2 pb-2 relative">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt da cena</h3>
        <textarea
          ref={promptTextareaRef}
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handlePromptKeyDown}
          placeholder="Descreva a prompt da cena aqui... Use '/' para adicionar uma referência."
          className="flex-1 w-full p-3 bg-gray-50/70 rounded-xl border border-gray-200/80 resize-none focus:ring-2 focus:ring-gray-800 focus:outline-none text-sm"
        />
        {showSuggestions && (
          <div className="absolute bottom-full mb-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={s.id}
                onClick={() => handleSuggestionClick(s)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${i === suggestionIndex ? 'bg-gray-100' : ''}`}
              >
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-xs text-gray-500">{s.types.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-2">
        <button
          onClick={onGenerate} disabled={isLoading || !baseImage || !prompt}
          className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Gerar imagem"}
        </button>
      </div>

    </aside>
  );
};

const ReferenceCard: React.FC<{reference: ReferenceImage, onUpdate: (ref: ReferenceImage) => void, onDelete: (id: string) => void}> = ({ reference, onUpdate, onDelete }) => {
    const handleTypeChange = (type: ReferenceType) => {
        const newTypes = reference.types.includes(type)
            ? reference.types.filter(t => t !== type)
            : [...reference.types, type];
        onUpdate({ ...reference, types: newTypes });
    };

    return (
        <div className="bg-white p-2 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center gap-2">
                <img src={reference.url} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <input 
                        type="text"
                        value={reference.name}
                        onChange={e => onUpdate({ ...reference, name: e.target.value })}
                        className="w-full text-sm font-semibold border-none p-1 rounded-md focus:ring-2 focus:ring-gray-800 bg-gray-50/50"
                    />
                </div>
                <button onClick={() => onDelete(reference.id)} className="text-gray-400 hover:text-red-500 text-xs font-semibold px-2">Remover</button>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
                {Object.values(ReferenceType).map(type => (
                    <label key={type} className="flex items-center gap-1 text-[11px] cursor-pointer text-gray-600 font-medium">
                        <input 
                            type="checkbox" 
                            checked={reference.types.includes(type)}
                            onChange={() => handleTypeChange(type)}
                            className="h-3 w-3 rounded-sm border-gray-300 text-gray-800 focus:ring-gray-800"
                        />
                        {type}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;