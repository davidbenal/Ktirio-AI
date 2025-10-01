import { ref, computed } from 'vue'

/**
 * Composable para controles de navegação do canvas
 *
 * Funcionalidades:
 * - Zoom com Ctrl+scroll (20% - 500%)
 * - Pan (arrastar) com mouse
 * - Reset de visualização
 * - Cursor dinâmico baseado no estado
 */
export function useCanvasControls() {
  // ========== ESTADOS ==========
  const zoom = ref(1) // Nível de zoom (1 = 100%)
  const panOffset = ref({ x: 0, y: 0 }) // Deslocamento X/Y
  const isPanning = ref(false) // Flag de arrasto ativo
  const panStart = ref({ x: 0, y: 0 }) // Ponto inicial do arrasto

  // ========== COMPUTED ==========
  const transformStyle = computed(() => ({
    transform: `translate(${panOffset.value.x}px, ${panOffset.value.y}px) scale(${zoom.value})`
  }))

  // ========== HANDLERS DE EVENTOS ==========

  /**
   * Controla zoom com roda do mouse
   * Ativa com: Ctrl+scroll ou Cmd+scroll (Mac)
   * Limites: 20% (0.2) até 500% (5.0)
   */
  const handleWheel = (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9 // Scroll up = zoom in
      zoom.value = Math.max(0.2, Math.min(5, zoom.value * zoomFactor))
    }
  }

  /**
   * Inicia arrasto do canvas
   * Condições: Sem ferramenta ativa + botão esquerdo + imagem carregada
   */
  const handleMouseDown = (event, activeTool, baseImage) => {
    if (activeTool === null && event.button === 0 && baseImage) {
      event.preventDefault()
      panStart.value = { x: event.clientX, y: event.clientY }
      isPanning.value = true
    }
  }

  /**
   * Atualiza posição durante arrasto
   * Calcula delta e aplica ao offset
   */
  const handleMouseMove = (event) => {
    if (isPanning.value) {
      const dx = event.clientX - panStart.value.x
      const dy = event.clientY - panStart.value.y
      panOffset.value = {
        x: panOffset.value.x + dx,
        y: panOffset.value.y + dy
      }
      panStart.value = { x: event.clientX, y: event.clientY }
    }
  }

  /**
   * Finaliza arrasto
   * Se zoom = 100%, centraliza canvas automaticamente
   */
  const handleMouseUp = () => {
    if (isPanning.value) {
      isPanning.value = false
      if (zoom.value === 1) {
        panOffset.value = { x: 0, y: 0 } // Auto-centraliza em 100%
      }
    }
  }

  // ========== FUNÇÕES UTILITÁRIAS ==========

  /**
   * Reseta visualização para padrão
   * Zoom 100% e centralizado
   */
  const resetView = () => {
    zoom.value = 1
    panOffset.value = { x: 0, y: 0 }
  }

  /**
   * Reseta quando nova imagem é carregada
   * Evita que usuário fique perdido com zoom/pan da imagem anterior
   */
  const resetOnNewImage = () => {
    zoom.value = 1
    panOffset.value = { x: 0, y: 0 }
  }

  /**
   * Retorna classe CSS do cursor baseado no contexto
   * - grabbing: arrastando
   * - grab: pode arrastar
   * - default: ferramenta ativa ou sem imagem
   */
  const getCursor = (activeTool, baseImage) => {
    if (isPanning.value) return 'cursor-grabbing'
    if (activeTool === null && baseImage) return 'cursor-grab'
    return 'cursor-default'
  }

  /**
   * Aplica zoom programaticamente
   */
  const setZoom = (newZoom) => {
    zoom.value = Math.max(0.2, Math.min(5, newZoom))
  }

  /**
   * Zoom para valor específico
   */
  const zoomTo = (level) => {
    setZoom(level)
  }

  /**
   * Zoom in (aumentar)
   */
  const zoomIn = () => {
    setZoom(zoom.value * 1.2)
  }

  /**
   * Zoom out (diminuir)
   */
  const zoomOut = () => {
    setZoom(zoom.value / 1.2)
  }

  return {
    // Estados exportados
    zoom,
    panOffset,
    isPanning,
    transformStyle,

    // Handlers de eventos
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,

    // Funções utilitárias
    resetView,
    resetOnNewImage,
    getCursor,
    setZoom,
    zoomTo,
    zoomIn,
    zoomOut
  }
}