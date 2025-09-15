
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { CameraIcon, SparklesIcon, PencilIcon, ShareIcon, PaintBrushIcon, EraserIcon, DownloadIcon, HistoryIcon, SelectToolIcon } from './icons';
import Canvas, { CanvasHandles } from './Canvas';
import { BrushMode, Project, Folder } from '../types';
import { editImageWithMask } from '../services/geminiService';
import EditPromptModal from './EditPromptModal';
import RightSidebar from './RightSidebar';

interface EditorProps {
    project: Project;
    folders: Folder[];
    onUpdateProject: (project: Project) => void;
    onBackToGallery: () => void;
    onDuplicateProject: () => void;
    onNewProjectFromVersion: () => void;
    onToggleFavorite: () => void;
    onToggleArchive: () => void;
    onMoveProject: (folderId: string) => void;
}


const Editor: React.FC<EditorProps> = ({ 
    project, 
    folders,
    onUpdateProject, 
    onBackToGallery,
    onDuplicateProject,
    onNewProjectFromVersion,
    onToggleFavorite,
    onToggleArchive,
    onMoveProject,
}) => {
    // Component state is initialized from the project prop
    const [baseImage, setBaseImage] = useState<string | null>(project.baseImage);
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(project.history[project.history.length - 1] || null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [brushSize, setBrushSize] = useState<number>(44);
    const [brushMode, setBrushMode] = useState<BrushMode>(BrushMode.Draw);
    const [activeTool, setActiveTool] = useState<ActiveTool | null>(null);
    const [objectImages, setObjectImages] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>(project.history);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalPosition, setEditModalPosition] = useState<{ x: number, y: number } | null>(null);
    const [projectName, setProjectName] = useState<string>(project.name);
    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState<boolean>(true);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState<boolean>(true);
    
    type ActiveTool = 'draw' | 'select';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasComponentRef = useRef<CanvasHandles>(null);

    // Effect to update parent state when project changes internally
    useEffect(() => {
        onUpdateProject({
            ...project,
            name: projectName,
            baseImage,
            history,
        });
    }, [projectName, baseImage, history]);

    const handleSetBaseImage = (img: string) => {
        setBaseImage(img);
        // Reset project progress when a new base image is uploaded
        const newHistory = img ? [img] : [];
        setHistory(newHistory);
        setGeneratedImage(null);
        setObjectImages([]);
    };

    const getMaskData = (): string | null => {
        if (!maskCanvasRef.current) return null;
        return maskCanvasRef.current.toDataURL('image/png');
    };

    const handleObjectImageUpload = (imageDataUrl: string) => {
        setObjectImages(prev => [...prev, imageDataUrl]);
    };

    const handleGenerate = async (promptToUse: string = prompt, objectsToUse: string[] = objectImages) => {
        const imageToEdit = generatedImage || baseImage;
        if (!imageToEdit) {
            setError("Please upload an image first.");
            return;
        }
        if (!promptToUse) {
            setError("Please provide a prompt.");
            return;
        }
        
        const maskData = getMaskData();
        if (!maskData) {
            setError("Could not get mask data from canvas.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await editImageWithMask(imageToEdit, maskData, promptToUse, objectsToUse);
            if(result.image) {
                const newImage = `data:image/png;base64,${result.image}`;
                setGeneratedImage(newImage);
                setHistory(prev => [...prev, newImage]);
            }
            if(result.text) {
                console.log("Model Text Response:", result.text);
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrawingStop = (event: MouseEvent) => {
        if (activeTool === 'select') {
            const mask = maskCanvasRef.current;
            if (mask) {
                const ctx = mask.getContext('2d', { willReadFrequently: true });
                if(!ctx) return;
                const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, mask.width, mask.height).data.buffer);
                const hasDrawing = pixelBuffer.some(color => color !== 0);
                if (hasDrawing) {
                    setEditModalPosition({ x: event.clientX, y: event.clientY });
                    setIsEditModalOpen(true);
                }
            }
        }
    };

    const handleApplyEdit = async (modalPrompt: string, modalObjectImages: string[]) => {
        setIsEditModalOpen(false);
        await handleGenerate(modalPrompt, modalObjectImages);
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        canvasComponentRef.current?.clearMask();
    };

    const handleDownload = () => {
        const imageToDownload = generatedImage || baseImage;
        if (imageToDownload) {
            const link = document.createElement('a');
            link.href = imageToDownload;
            link.download = `${projectName.replace(/ /g, "_")}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleToolSelect = (tool: ActiveTool) => {
        setActiveTool(prev => prev === tool ? null : tool);
    };
    
    const handleSelectHistory = (image: string) => {
        const index = history.findIndex(h => h === image);
        if (index === 0 && baseImage === image) {
            setGeneratedImage(null); // Back to original
        } else if (index > -1) {
            setGeneratedImage(history[index]);
        }
    }


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                project={project}
                folders={folders}
                onImageUpload={handleSetBaseImage}
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={() => handleGenerate()}
                isLoading={isLoading}
                baseImage={baseImage}
                objectImages={objectImages}
                onObjectImageUpload={handleObjectImageUpload}
                projectName={projectName}
                onProjectNameChange={setProjectName}
                onShowHistory={() => setIsRightSidebarVisible(prev => !prev)}
                onExport={handleDownload}
                isCollapsed={!isLeftSidebarVisible}
                onToggleCollapse={() => setIsLeftSidebarVisible(prev => !prev)}
                onBackToGallery={onBackToGallery}
                onDuplicateProject={onDuplicateProject}
                onNewProjectFromVersion={onNewProjectFromVersion}
                onToggleFavorite={onToggleFavorite}
                onToggleArchive={onToggleArchive}
                onMoveProject={onMoveProject}
            />
            <main className="flex-1 flex flex-col p-0 relative">
                <div className="flex-1 bg-gray-100 rounded-2xl p-4 flex flex-col relative">
                    {baseImage ? (
                        <>
                           <div className="absolute top-4 right-4 z-20">
                                <button onClick={handleDownload} className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2">
                                    <DownloadIcon className="w-5 h-5" />
                                    <span>Download da composição</span>
                                </button>
                            </div>
                            <Canvas
                                ref={canvasComponentRef}
                                baseImage={baseImage}
                                generatedImage={generatedImage}
                                brushSize={brushSize}
                                brushMode={brushMode}
                                canvasRef={canvasRef}
                                maskCanvasRef={maskCanvasRef}
                                onDrawingStop={handleDrawingStop}
                            />
                            {/* Brush Controls */}
                           {activeTool && (
                             <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
                                <div className="bg-gray-800/90 backdrop-blur-sm p-2 rounded-xl shadow-lg flex items-center gap-2">
                                    <span className="text-white text-xs px-2">Pequeno</span>
                                    <input 
                                        type="range" 
                                        min="5" 
                                        max="100" 
                                        value={brushSize} 
                                        onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                                        className="w-32"
                                    />
                                    <span className="text-white text-xs px-2">Grande</span>
                                    <span className="w-8 text-center text-sm font-medium text-white">{brushSize}px</span>
                                </div>
                            </div>
                           )}

                             {/* Tool Selector */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg flex items-center gap-2 z-20">
                                <button onClick={() => handleToolSelect('draw')} className={`p-3 rounded-full ${activeTool === 'draw' ? 'bg-white text-gray-800' : 'text-white hover:bg-white/20'}`}><PaintBrushIcon className="w-6 h-6"/></button>
                                <button onClick={() => handleToolSelect('select')} className={`p-3 rounded-full ${activeTool === 'select' ? 'bg-white text-gray-800' : 'text-white hover:bg-white/20'}`}><SelectToolIcon className="w-6 h-6"/></button>
                                <div className="h-6 w-px bg-white/30 mx-1"></div>
                                <button onClick={() => setBrushMode(brushMode === BrushMode.Draw ? BrushMode.Erase : BrushMode.Draw)} className={`p-3 rounded-full ${brushMode === BrushMode.Erase ? 'bg-white text-gray-800' : 'text-white hover:bg-white/20'}`}><EraserIcon className="w-6 h-6"/></button>
                            </div>
                        </>
                    ) : (
                        <WelcomeView onImageUpload={handleSetBaseImage} />
                    )}
                    {error && <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 p-3 rounded-lg z-30">{error}</div>}
                </div>
            </main>
            <RightSidebar
                history={history}
                isCollapsed={!isRightSidebarVisible}
                onToggleCollapse={() => setIsRightSidebarVisible(prev => !prev)}
                onSelect={handleSelectHistory}
                currentImage={generatedImage || baseImage}
            />
            {isEditModalOpen && editModalPosition && (
                <EditPromptModal 
                    isOpen={isEditModalOpen}
                    position={editModalPosition}
                    onApply={handleApplyEdit}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};


const InfoCard: React.FC<{ num: string; title: string; icon: React.ReactNode }> = ({ num, title, icon }) => (
    <div className="flex flex-col items-start p-4 text-left">
      <div className="flex items-center gap-4">
        <div className="text-gray-500 font-light">{num}</div>
        <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-gray-800 text-sm">{title}</p>
    </div>
);
  
const WelcomeView: React.FC<{onImageUpload: (dataUrl: string) => void}> = ({onImageUpload}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex-1 flex items-center justify-center flex-col text-center p-8 bg-gray-50 rounded-xl"
             style={{ backgroundImage: `url(https://picsum.photos/1200/800?grayscale&blur=1)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800">O que vamos criar hoje?</h2>
                <div className="mt-8 w-full max-w-2xl bg-white/30 border border-white/20 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-300/50">
                        <InfoCard num="01" title="Envie foto do ambiente" icon={<CameraIcon className="h-8 w-8" />} />
                        <InfoCard num="02" title="Decore e customize do seu jeito" icon={<SparklesIcon className="h-8 w-8" />} />
                        <InfoCard num="03" title="Edite ou inclua objetos no ambiente" icon={<PencilIcon className="h-8 w-8" />} />
                        <InfoCard num="04" title="Baixe e compartilhe" icon={<ShareIcon className="h-8 w-8" />} />
                    </div>
                </div>
                <div className="mt-8 flex gap-4 justify-center">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                        Upload de foto
                    </button>
                    {/* Placeholder for camera functionality */}
                    <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Tirar foto
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Editor;
