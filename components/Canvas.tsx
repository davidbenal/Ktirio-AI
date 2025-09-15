import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { BrushMode } from '../types';
import useCanvasDrawing from '../hooks/useCanvasDrawing';

interface CanvasProps {
  baseImage: string;
  generatedImage: string | null;
  brushSize: number;
  brushMode: BrushMode;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  maskCanvasRef: React.RefObject<HTMLCanvasElement>;
  onDrawingStop: (event: MouseEvent) => void;
}

export interface CanvasHandles {
    clearMask: () => void;
}

// FIX: Removed React.FC<CanvasProps> type annotation.
// The type of a component created with React.forwardRef is not compatible with React.FC,
// which does not accept a ref property. The correct type is inferred from forwardRef.
const Canvas = forwardRef<CanvasHandles, CanvasProps>(({ 
    baseImage,
    generatedImage,
    brushSize,
    brushMode,
    canvasRef,
    maskCanvasRef,
    onDrawingStop
}, ref) => {
    
    const containerRef = useRef<HTMLDivElement>(null);

    const { isDrawing, startDrawing, draw, stopDrawing, clearCanvas } = useCanvasDrawing({
        canvas: maskCanvasRef,
        brushSize,
        brushMode
    });

    useImperativeHandle(ref, () => ({
        clearMask() {
            clearCanvas();
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !maskCanvas || !container) return;

        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!ctx || !maskCtx) return;

        const image = new Image();
        image.src = generatedImage || baseImage;
        image.onload = () => {
            const containerRatio = container.clientWidth / container.clientHeight;
            const imageRatio = image.width / image.height;
            
            let canvasWidth, canvasHeight;
            if (containerRatio > imageRatio) {
                canvasHeight = container.clientHeight;
                canvasWidth = canvasHeight * imageRatio;
            } else {
                canvasWidth = container.clientWidth;
                canvasHeight = canvasWidth / imageRatio;
            }
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            maskCanvas.width = canvasWidth;
            maskCanvas.height = canvasHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            if (generatedImage) {
                 maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            }
        };
    }, [baseImage, generatedImage, canvasRef, maskCanvasRef]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        startDrawing(e.nativeEvent);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            draw(e.nativeEvent);
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            stopDrawing();
            onDrawingStop(e.nativeEvent);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            stopDrawing();
            onDrawingStop(e.nativeEvent);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
            <canvas ref={canvasRef} className="absolute" />
            <canvas
                ref={maskCanvasRef}
                className="absolute cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    );
});

export default Canvas;