import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { CameraIcon, SparklesIcon, PencilIcon, ShareIcon, PaintBrushIcon, EraserIcon, DownloadIcon, HistoryIcon, SelectToolIcon, SpinnerIcon } from './icons';
import Canvas, { CanvasHandles } from './Canvas';
import { BrushMode, Project, Folder, ReferenceImage } from '../types';
import { editImageWithMask } from '../services/geminiService';
import EditPromptModal from './EditPromptModal';
import RightSidebar from './RightSidebar';

interface EditorProps {
    project: Project;
    folders: Folder[];
    onUpdateProject: (project: Project) => void;
    onBackToGallery: () => void;
    onDuplicateProject: () => void;
    onNewProjectFromVersion: (image?: string) => void;
    onToggleFavorite: () => void;
    onToggleArchive: () => void;
    onMoveProject: (folderId: string) => void;
}

const LoadingModal: React.FC = () => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800/90 text-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <SpinnerIcon className="w-10 h-10 text-blue-400" />
            <h3 className="text-xl font-bold">Processando com IA...</h3>
            <p className="text-sm text-gray-300">Isso pode levar alguns segundos...</p>
        </div>
    </div>
);


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
    const [objectImages, setObjectImages] = useState<ReferenceImage[]>([]);
    const [history, setHistory] = useState<string[]>(project.history);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editModalPosition, setEditModalPosition] = useState<{ x: number, y: number } | null>(null);
    const [projectName, setProjectName] = useState<string>(project.name);
    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState<boolean>(true);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState<boolean>(true);
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });
    
    type ActiveTool = 'draw' | 'select';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasComponentRef = useRef<CanvasHandles>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

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
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const getMaskData = (): string | null => {
        if (!maskCanvasRef.current) return null;
        return maskCanvasRef.current.toDataURL('image/png');
    };

    const handleAddReferenceImage = (imageDataUrl: string) => {
        const newRef: ReferenceImage = {
            id: `ref-${Date.now()}`,
            url: imageDataUrl,
            name: `Referência ${objectImages.length + 1}`,
            types: [],
        };
        setObjectImages(prev => [...prev, newRef]);
    };

    const handleUpdateReferenceImage = (updatedRef: ReferenceImage) => {
        setObjectImages(prev => prev.map(ref => ref.id === updatedRef.id ? updatedRef : ref));
    };

    const handleDeleteReferenceImage = (refId: string) => {
        setObjectImages(prev => prev.filter(ref => ref.id !== refId));
    };

    const handleGenerate = async (promptToUse: string = prompt, objectsToUse: ReferenceImage[] = objectImages) => {
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

    const handleApplyEdit = async (modalPrompt: string, modalObjectImages: ReferenceImage[]) => {
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

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            setZoom(prevZoom => Math.max(0.2, Math.min(5, prevZoom * zoomFactor)));
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        if (activeTool === null && e.button === 0 && baseImage) {
            e.preventDefault();
            panStartRef.current = { x: e.clientX, y: e.clientY };
            setIsPanning(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (isPanning) {
            const dx = e.clientX - panStartRef.current.x;
            const dy = e.clientY - panStartRef.current.y;
            setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            panStartRef.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            if (zoom === 1) {
                setPanOffset({ x: 0, y: 0 });
            }
        }
    };


    return (
        <div className="flex w-full h-screen p-4 gap-4 box-border">
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
                onAddReferenceImage={handleAddReferenceImage}
                onUpdateReferenceImage={handleUpdateReferenceImage}
                onDeleteReferenceImage={handleDeleteReferenceImage}
                projectName={projectName}
                onProjectNameChange={setProjectName}
                onShowHistory={() => setIsRightSidebarVisible(prev => !prev)}
                onExport={handleDownload}
                isCollapsed={!isLeftSidebarVisible}
                onToggleCollapse={() => setIsLeftSidebarVisible(prev => !prev)}
                onBackToGallery={onBackToGallery}
                onDuplicateProject={onDuplicateProject}
                onNewProjectFromVersion={() => onNewProjectFromVersion()}
                onToggleFavorite={onToggleFavorite}
                onToggleArchive={onToggleArchive}
                onMoveProject={onMoveProject}
            />
            <main 
                className={`flex-1 flex flex-col relative bg-white rounded-2xl shadow-lg overflow-hidden ${isPanning ? 'cursor-grabbing' : activeTool === null && baseImage ? 'cursor-grab' : 'cursor-default'}`}
                ref={canvasContainerRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                
                    {baseImage ? (
                        <>
                           <div className="absolute top-4 right-4 z-20 flex gap-2">
                                <button onClick={handleDownload} className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium">
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                                <button onClick={() => setIsRightSidebarVisible(p => !p)} className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium">
                                    <HistoryIcon className="w-4 h-4" />
                                    <span>Histórico</span>
                                </button>
                            </div>
                            <div 
                                className="w-full h-full flex items-center justify-center relative transition-transform duration-100" 
                                style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`}}
                            >
                                <Canvas
                                    ref={canvasComponentRef}
                                    baseImage={baseImage}
                                    generatedImage={generatedImage}
                                    brushSize={brushSize}
                                    brushMode={brushMode}
                                    canvasRef={canvasRef}
                                    maskCanvasRef={maskCanvasRef}
                                    onDrawingStop={handleDrawingStop}
                                    zoom={zoom}
                                    activeTool={activeTool}
                                />
                            </div>

                            {zoom !== 1 && (
                                <button
                                    onClick={() => {
                                        setZoom(1);
                                        setPanOffset({ x: 0, y: 0 });
                                    }}
                                    className="absolute bottom-4 right-4 z-20 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors text-sm font-medium"
                                >
                                    100%
                                </button>
                            )}

                            {/* Brush Controls */}
                           {activeTool && (
                             <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
                                <div className="bg-white p-2 rounded-xl shadow-lg flex items-center gap-2 border border-gray-100">
                                    <span className="text-gray-600 text-xs px-2">Pequeno</span>
                                    <input 
                                        type="range" 
                                        min="5" 
                                        max="100" 
                                        value={brushSize} 
                                        onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                                        className="w-32"
                                    />
                                    <span className="text-gray-600 text-xs px-2">Grande</span>
                                    <span className="w-10 text-center text-sm font-medium text-gray-800 bg-gray-100 rounded-md py-1">{brushSize}</span>
                                </div>
                            </div>
                           )}

                             {/* Tool Selector */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white backdrop-blur-sm p-2 rounded-full shadow-lg flex items-center gap-1 border border-gray-100 z-20">
                                <button onClick={() => handleToolSelect('draw')} className={`p-3 rounded-full ${activeTool === 'draw' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><PaintBrushIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleToolSelect('select')} className={`p-3 rounded-full ${activeTool === 'select' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><SelectToolIcon className="w-5 h-5"/></button>
                                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                                <button onClick={() => setBrushMode(brushMode === BrushMode.Draw ? BrushMode.Erase : BrushMode.Draw)} className={`p-3 rounded-full ${brushMode === BrushMode.Erase ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><EraserIcon className="w-5 h-5"/></button>
                            </div>
                        </>
                    ) : (
                        <WelcomeView onImageUpload={handleSetBaseImage} />
                    )}
                    {isLoading && <LoadingModal />}
                    {error && <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 p-3 rounded-lg z-30 shadow-lg border border-red-200">{error}</div>}
            </main>
            <RightSidebar
                history={history}
                isCollapsed={!isRightSidebarVisible}
                onToggleCollapse={() => setIsRightSidebarVisible(prev => !prev)}
                onSelect={handleSelectHistory}
                currentImage={generatedImage || baseImage}
                onNewProjectFromVersion={onNewProjectFromVersion}
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
        <div className="flex-1 flex items-center justify-center flex-col text-center p-8 bg-gray-50/50">
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-800">O que vamos criar hoje?</h2>
                <p className="text-gray-600 mt-2">Comece enviando uma foto do ambiente que você deseja transformar.</p>
                <div className="mt-8 w-full bg-white/50 border border-gray-200/80 rounded-2xl p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        <InfoCard num="01" title="Envie a foto" icon={<CameraIcon className="h-7 w-7" />} />
                        <InfoCard num="02" title="Decore e customize" icon={<SparklesIcon className="h-7 w-7" />} />
                        <InfoCard num="03" title="Edite ou inclua" icon={<PencilIcon className="h-7 w-7" />} />
                        <InfoCard num="04" title="Baixe e compartilhe" icon={<ShareIcon className="h-7 w-7" />} />
                    </div>
                </div>
                <div className="mt-8 flex gap-4 justify-center">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-transform hover:scale-105">
                        Upload de foto
                    </button>
                    {/* Placeholder for camera functionality */}
                    <button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 border border-gray-200 transition-transform hover:scale-105">
                        Tirar foto
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Editor;