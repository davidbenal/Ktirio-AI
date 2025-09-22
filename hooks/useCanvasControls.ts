import { useState, useRef, useCallback } from 'react';

/**
 * useCanvasControls - Controles de navegação do canvas
 *
 * Este hook gerencia toda a lógica de navegação visual:
 * - Zoom com Ctrl+scroll
 * - Pan (arrastar) com clique do mouse
 * - Reset de visualização
 * - Cursor dinâmico baseado no estado
 *
 * Uso: const controls = useCanvasControls();
 */
export const useCanvasControls = () => {
  // ========== ESTADOS ==========
  const [zoom, setZoom] = useState(1);                    // Nível de zoom (1 = 100%)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Deslocamento X/Y
  const [isPanning, setIsPanning] = useState(false);      // Flag de arrasto ativo
  const panStartRef = useRef({ x: 0, y: 0 });            // Ponto inicial do arrasto

  // ========== HANDLERS DE EVENTOS ==========

  /**
   * Controla zoom com roda do mouse
   * Ativa com: Ctrl+scroll ou Cmd+scroll (Mac)
   * Limites: 20% (0.2) até 500% (5.0)
   */
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;  // Scroll up = zoom in
      setZoom(prevZoom => Math.max(0.2, Math.min(5, prevZoom * zoomFactor)));
    }
  }, []);

  /**
   * Inicia arrasto do canvas
   * Condições: Sem ferramenta ativa + botão esquerdo + imagem carregada
   */
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>, activeTool: string | null, baseImage: string | null) => {
    if (activeTool === null && e.button === 0 && baseImage) {
      e.preventDefault();
      panStartRef.current = { x: e.clientX, y: e.clientY };
      setIsPanning(true);
    }
  }, []);

  /**
   * Atualiza posição durante arrasto
   * Calcula delta e aplica ao offset
   */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  /**
   * Finaliza arrasto
   * Se zoom = 100%, centraliza canvas automaticamente
   */
  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      if (zoom === 1) {
        setPanOffset({ x: 0, y: 0 });  // Auto-centraliza em 100%
      }
    }
  }, [isPanning, zoom]);

  // ========== FUNÇÕES UTILITÁRIAS ==========

  /**
   * Reseta visualização para padrão
   * Zoom 100% e centralizado
   */
  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  /**
   * Reseta quando nova imagem é carregada
   * Evita que usuário fique perdido com zoom/pan da imagem anterior
   */
  const resetOnNewImage = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  return {
    // Estados exportados
    zoom,                // Nível atual de zoom
    panOffset,          // Posição X/Y do canvas
    isPanning,          // Estado de arrasto

    // Handlers de eventos
    handleWheel,        // Controle de zoom
    handleMouseDown,    // Início do pan
    handleMouseMove,    // Arrasto em andamento
    handleMouseUp,      // Fim do pan

    // Funções utilitárias
    resetView,          // Volta para 100% centralizado
    resetOnNewImage,    // Reset ao trocar imagem

    /**
     * Retorna classe CSS do cursor baseado no contexto
     * - grabbing: arrastando
     * - grab: pode arrastar
     * - default: ferramenta ativa ou sem imagem
     */
    getCursor: (activeTool: string | null, baseImage: string | null) => {
      if (isPanning) return 'cursor-grabbing';
      if (activeTool === null && baseImage) return 'cursor-grab';
      return 'cursor-default';
    }
  };
};