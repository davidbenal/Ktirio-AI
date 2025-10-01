import { ref } from 'vue'

/**
 * Composable para controle de desenho no canvas
 *
 * Funcionalidades:
 * - Desenho com mouse/touch
 * - Suporte a zoom (coordenadas ajustadas)
 * - Diferentes ferramentas (lápis, seleção retangular, circular, etc.)
 * - Limpeza de canvas
 */
export function useCanvasDrawing({ canvas, brushSize, zoom, activeTool }) {
  const isDrawing = ref(false)
  const lastPosition = ref(null)
  const startPosition = ref(null)

  /**
   * Calcula coordenadas do mouse/touch ajustadas para zoom
   */
  const getCoordinates = (event) => {
    if (!canvas.value) return null

    const rect = canvas.value.getBoundingClientRect()
    const point = event.touches ? event.touches[0] : event

    // Ajusta coordenadas para o nível de zoom
    return {
      x: (point.clientX - rect.left) / zoom.value,
      y: (point.clientY - rect.top) / zoom.value
    }
  }

  /**
   * Inicia o processo de desenho
   */
  const startDrawing = (event) => {
    const coords = getCoordinates(event)
    if (coords) {
      isDrawing.value = true
      lastPosition.value = coords
      startPosition.value = coords
    }
  }

  /**
   * Desenha no canvas baseado na ferramenta ativa
   */
  const draw = (event) => {
    if (!isDrawing.value || !canvas.value) return

    const ctx = canvas.value.getContext('2d', { willReadFrequently: true })
    const coords = getCoordinates(event)
    if (!ctx || !coords) return

    // Configurações básicas
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalCompositeOperation = 'source-over'

    const tool = activeTool.value

    if (tool === 'draw') {
      // Ferramenta de lápis - desenho livre com máscara verde forte
      if (!lastPosition.value) return

      // Usa verde forte e semi-transparente para destacar área
      ctx.globalAlpha = 0.6
      ctx.strokeStyle = '#00FF00' // Verde neon para visibilidade
      ctx.fillStyle = '#00FF00'
      ctx.lineWidth = brushSize.value

      // Desenha linha
      ctx.beginPath()
      ctx.moveTo(lastPosition.value.x, lastPosition.value.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()

      // Também preenche um círculo para garantir cobertura
      ctx.beginPath()
      ctx.arc(coords.x, coords.y, brushSize.value / 2, 0, Math.PI * 2)
      ctx.fill()

      lastPosition.value = coords
    }
    else if (tool === 'remove') {
      // Ferramenta de remoção - apaga áreas
      if (!lastPosition.value) return

      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize.value
      ctx.beginPath()
      ctx.moveTo(lastPosition.value.x, lastPosition.value.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()

      lastPosition.value = coords
    }
    else if (tool === 'ruler') {
      // Ferramenta de régua - desenha linhas de medição
      if (!startPosition.value) return

      // Limpa canvas e redesenha régua
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)'
      ctx.lineWidth = 2

      // Desenha linha principal
      ctx.beginPath()
      ctx.moveTo(startPosition.value.x, startPosition.value.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()

      // Calcula distância
      const distance = Math.sqrt(
        Math.pow(coords.x - startPosition.value.x, 2) +
        Math.pow(coords.y - startPosition.value.y, 2)
      )

      // Desenha texto da distância
      ctx.fillStyle = 'rgba(255, 0, 0, 1)'
      ctx.font = '14px Arial'
      const midX = (startPosition.value.x + coords.x) / 2
      const midY = (startPosition.value.y + coords.y) / 2
      ctx.fillText(`${Math.round(distance)}px`, midX, midY - 10)
    }
  }

  /**
   * Para o desenho
   */
  const stopDrawing = () => {
    isDrawing.value = false
    lastPosition.value = null
    startPosition.value = null
  }

  /**
   * Limpa todo o canvas
   */
  const clearCanvas = () => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }
  }

  return {
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    brushSize,
    activeTool
  }
}