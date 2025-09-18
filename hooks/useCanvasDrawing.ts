import { useState, useRef, RefObject } from 'react';
import { BrushMode } from '../types';

interface UseCanvasDrawingProps {
  canvas: RefObject<HTMLCanvasElement>;
  brushSize: number;
  brushMode: BrushMode;
  zoom: number;
}

const useCanvasDrawing = ({ canvas, brushSize, brushMode, zoom }: UseCanvasDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);

  const getCoordinates = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!canvas.current) return null;

    const rect = canvas.current.getBoundingClientRect();
    const point = 'touches' in event ? event.touches[0] : event;

    // Adjust coordinates for canvas zoom level
    return {
      x: (point.clientX - rect.left) / zoom,
      y: (point.clientY - rect.top) / zoom,
    };
  };

  const startDrawing = (event: MouseEvent | TouchEvent) => {
    const coords = getCoordinates(event);
    if (coords) {
      setIsDrawing(true);
      lastPosition.current = coords;
    }
  };

  const draw = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing || !canvas.current) return;

    const ctx = canvas.current.getContext('2d');
    const coords = getCoordinates(event);
    if (!ctx || !coords || !lastPosition.current) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (brushMode === BrushMode.Draw) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // Use semi-transparent white for the mask
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.beginPath();
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    lastPosition.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosition.current = null;
  };

  const clearCanvas = () => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }
  };


  return { isDrawing, startDrawing, draw, stopDrawing, clearCanvas };
};

export default useCanvasDrawing;