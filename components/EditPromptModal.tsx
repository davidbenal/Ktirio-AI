import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from './icons';
import { ReferenceImage, ReferenceType } from '../types';

interface EditPromptModalProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onApply: (prompt: string, objectImages: ReferenceImage[]) => void;
    onCancel: () => void;
}

const EditPromptModal: React.FC<EditPromptModalProps> = ({ isOpen, position, onApply, onCancel }) => {
    const [prompt, setPrompt] = useState('');
    const [objectImages, setObjectImages] = useState<ReferenceImage[]>([]);
    const objectFileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPrompt('');
            setObjectImages([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (prompt) {
                    onApply(prompt, objectImages);
                }
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onApply, onCancel, prompt, objectImages]);

    const handleObjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const newRef: ReferenceImage = {
                        id: `modal-ref-${Date.now()}`,
                        url: e.target.result as string,
                        name: `Referência ${objectImages.length + 1}`,
                        types: [],
                    };
                    setObjectImages(prev => [...prev, newRef]);
                }
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };
    
    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="fixed z-30 bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl shadow-2xl p-4 w-80 border border-gray-200"
            style={{ 
                top: position.y + 15, 
                left: position.x - 160, // Center modal on cursor
            }}
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-md">Descreva a edição</h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: adicione uma estampa floral, mude para cor azul..."
                className="w-full p-2 bg-gray-100 rounded-lg resize-none focus:ring-2 focus:ring-gray-800 focus:outline-none h-24 text-sm border border-gray-200"
                autoFocus
            />
            
            <div className="flex items-center gap-2 flex-wrap mt-2">
                {objectImages.map((img, index) => (
                    <div key={index} className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-200">
                        <img src={img.url} alt={`Object ${index + 1}`} className="h-full w-full object-cover"/>
                    </div>
                ))}
                <button 
                    onClick={() => objectFileInputRef.current?.click()} 
                    className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors border border-gray-200"
                >
                    <PlusIcon className="w-5 h-5"/>
                </button>
                <input type="file" ref={objectFileInputRef} onChange={handleObjectFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="mt-4 flex gap-2">
                 <button
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => onApply(prompt, objectImages)}
                    disabled={!prompt}
                    className="flex-1 py-2 px-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Aplicar Edição
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Enter para aplicar • Esc para cancelar</p>
        </div>
    );
};

export default EditPromptModal;