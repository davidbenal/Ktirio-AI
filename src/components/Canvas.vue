<template>
  <div
    class="canvas-container relative overflow-auto bg-gray-100 flex items-center justify-center min-h-96 w-full"
    :class="canvasControls.getCursor(activeTool, baseImage)"
    @wheel="canvasControls.handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- Container com transform aplicado -->
    <div
      class="canvas-wrapper relative"
      :style="{
        transform: `translate(${canvasControls.panOffset.value.x}px, ${canvasControls.panOffset.value.y}px) scale(${canvasControls.zoom.value})`
      }"
    >
      <!-- Canvas da imagem base -->
      <canvas
        ref="baseCanvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="border border-gray-300"
        style="display: block; z-index: 1; position: relative;"
      ></canvas>

      <!-- Canvas da máscara (para desenho) -->
      <canvas
        ref="maskCanvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="absolute top-0 left-0 pointer-events-none"
        :class="{ 'pointer-events-auto': isAnyToolActive }"
        @mousedown="handleDrawStart"
        @mousemove="handleDraw"
        @mouseup="handleDrawEnd"
        @touchstart="handleDrawStart"
        @touchmove="handleDraw"
        @touchend="handleDrawEnd"
        style="display: block; z-index: 2;"
      ></canvas>

      <!-- Overlay de grade -->
      <div
        v-if="isGridVisible"
        class="absolute inset-0 pointer-events-none grid-overlay"
        :style="{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px'
        }"
      ></div>

      <!-- Overlay de loading quando gerando -->
      <div
        v-if="isGenerating"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white rounded-lg p-4 shadow-lg">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span class="text-gray-700">Gerando com IA...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles de grade e zoom -->
    <div class="absolute bottom-2 right-2 flex flex-col space-y-2">
      <!-- Botão de Grade -->
      <button
        @click="toggleGrid"
        :class="[
          'w-8 h-8 shadow-md rounded border flex items-center justify-center text-xs transition-colors',
          isGridVisible
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        ]"
        title="Mostrar/Ocultar Grade"
      >
        ⊞
      </button>

      <button
        @click="canvasControls.zoomIn"
        class="w-8 h-8 bg-white shadow-md rounded border flex items-center justify-center hover:bg-gray-50"
        title="Zoom In"
      >
        +
      </button>
      <button
        @click="canvasControls.zoomOut"
        class="w-8 h-8 bg-white shadow-md rounded border flex items-center justify-center hover:bg-gray-50"
        title="Zoom Out"
      >
        −
      </button>
      <button
        @click="canvasControls.resetView"
        class="w-8 h-8 bg-white shadow-md rounded border flex items-center justify-center hover:bg-gray-50 text-xs"
        title="Reset View"
      >
        1:1
      </button>
    </div>

    <!-- Indicador de zoom -->
    <div class="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-sm">
      {{ Math.round(canvasControls.zoom.value * 100) }}%
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useCanvasDrawing } from '../composables/useCanvasDrawing.js'
import { useCanvasControls } from '../composables/useCanvasControls.js'

export default {
  name: 'Canvas',
  props: {
    baseImage: {
      type: String,
      default: null
    },
    generatedImage: {
      type: String,
      default: null
    },
    brushSize: {
      type: Number,
      default: 44
    },
    activeTool: {
      type: String,
      default: null
    },
    isGenerating: {
      type: Boolean,
      default: false
    },
    fixedDimensions: {
      type: Object,
      default: () => ({ width: null, height: null })
    }
  },
  emits: ['drawing-stop', 'dimensions-set'],
  setup(props, { emit, expose }) {
    // ========== REFS ==========
    const baseCanvasRef = ref(null)
    const maskCanvasRef = ref(null)
    const canvasWidth = ref(800)
    const canvasHeight = ref(600)

    // ========== COMPOSABLES ==========
    const canvasControls = useCanvasControls()

    const canvasDrawing = useCanvasDrawing({
      canvas: maskCanvasRef,
      brushSize: ref(props.brushSize),
      zoom: canvasControls.zoom,
      activeTool: ref(props.activeTool)
    })

    // ========== COMPUTED ==========
    const isAnyToolActive = ref(false)
    const isGridVisible = ref(false)

    // ========== MÉTODOS ==========

    /**
     * Carrega imagem no canvas base
     */
    const loadImageToCanvas = async (imageUrl) => {
      if (!baseCanvasRef.value || !imageUrl || typeof imageUrl !== 'string') {
        return
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = async () => {
        // Determina as dimensões alvo
        let targetWidth = img.width
        let targetHeight = img.height

        if (props.fixedDimensions.width && props.fixedDimensions.height) {
          // Usa dimensões fixas já definidas (prioritário)
          targetWidth = props.fixedDimensions.width
          targetHeight = props.fixedDimensions.height
        } else {
          // Define dimensões fixas baseadas na primeira imagem carregada
          emit('dimensions-set', { width: img.width, height: img.height })
        }

        // Atualiza as dimensões do canvas
        canvasWidth.value = targetWidth
        canvasHeight.value = targetHeight

        // Aguarda o Vue atualizar o DOM
        await nextTick()

        const canvas = baseCanvasRef.value
        if (!canvas) return

        const ctx = canvas.getContext('2d')

        // Ajusta tamanho interno do canvas
        canvas.width = targetWidth
        canvas.height = targetHeight

        // Ajusta também o canvas da máscara
        if (maskCanvasRef.value) {
          maskCanvasRef.value.width = targetWidth
          maskCanvasRef.value.height = targetHeight
        }

        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Desenha a imagem redimensionada se necessário
        if (img.width !== targetWidth || img.height !== targetHeight) {
          // Redimensiona para caber mantendo proporção
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        } else {
          // Desenha sem redimensionar
          ctx.drawImage(img, 0, 0)
        }

        // Força redraw do canvas
        canvas.style.display = 'none'
        canvas.offsetHeight // Força recalculo
        canvas.style.display = 'block'
      }

      img.onerror = (error) => {
        console.error('Erro ao carregar imagem:', error)
      }

      img.src = imageUrl
    }

    // ========== WATCHERS ==========

    // Observa mudanças na imagem para recarregar
    watch(() => props.generatedImage || props.baseImage, (newImageUrl) => {
      if (newImageUrl && typeof newImageUrl === 'string') {
        loadImageToCanvas(newImageUrl)
        canvasControls.resetOnNewImage()
      }
    }, { immediate: true })

    // Observa ferramenta ativa
    watch(() => props.activeTool, (newTool) => {
      isAnyToolActive.value = newTool !== null
    })

    // Observa props do brush
    watch(() => props.brushSize, (newSize) => {
      canvasDrawing.brushSize.value = newSize
    })

    // Observa mudanças na ferramenta ativa
    watch(() => props.activeTool, (newTool) => {
      canvasDrawing.activeTool.value = newTool
    })

    /**
     * Limpa o canvas da máscara
     */
    const clearMask = () => {
      canvasDrawing.clearCanvas()
    }

    /**
     * Obtém dados da máscara como data URL
     */
    const getMaskDataUrl = () => {
      return maskCanvasRef.value?.toDataURL() || null
    }

    /**
     * Combina imagem base com máscara para enviar à IA
     */
    const getCombinedImageWithMask = () => {
      if (!baseCanvasRef.value || !maskCanvasRef.value) return null

      // Cria canvas temporário para combinar
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = baseCanvasRef.value.width
      tempCanvas.height = baseCanvasRef.value.height
      const tempCtx = tempCanvas.getContext('2d')

      // Desenha imagem base primeiro
      tempCtx.drawImage(baseCanvasRef.value, 0, 0)

      // Sobrepõe a máscara verde
      tempCtx.drawImage(maskCanvasRef.value, 0, 0)

      return tempCanvas.toDataURL()
    }

    /**
     * Verifica se há desenho na máscara
     */
    const hasMaskDrawing = () => {
      if (!maskCanvasRef.value) return false

      const ctx = maskCanvasRef.value.getContext('2d', { willReadFrequently: true })
      if (!ctx) return false

      const imageData = ctx.getImageData(0, 0, maskCanvasRef.value.width, maskCanvasRef.value.height)
      const pixelBuffer = new Uint32Array(imageData.data.buffer)
      return pixelBuffer.some(color => color !== 0)
    }

    /**
     * Alterna visibilidade da grade
     */
    const toggleGrid = () => {
      isGridVisible.value = !isGridVisible.value
    }

    // ========== HANDLERS DE EVENTOS ==========

    const handleMouseDown = (event) => {
      canvasControls.handleMouseDown(event, props.activeTool, props.baseImage)
    }

    const handleMouseMove = (event) => {
      canvasControls.handleMouseMove(event)
    }

    const handleMouseUp = () => {
      canvasControls.handleMouseUp()
    }

    const handleDrawStart = (event) => {
      if (props.activeTool) {
        event.preventDefault()
        canvasDrawing.startDrawing(event)
      }
    }

    const handleDraw = (event) => {
      if (props.activeTool && canvasDrawing.isDrawing.value) {
        event.preventDefault()
        canvasDrawing.draw(event)
      }
    }

    const handleDrawEnd = (event) => {
      if (props.activeTool && canvasDrawing.isDrawing.value) {
        canvasDrawing.stopDrawing()
        emit('drawing-stop', event)
      }
    }

    // ========== MÉTODOS EXPOSTOS ==========

    expose({
      clearMask,
      getMaskDataUrl,
      getCombinedImageWithMask,
      hasMaskDrawing,
      baseCanvasRef,
      maskCanvasRef
    })

    // ========== LIFECYCLE ==========

    onMounted(() => {
      const initialImage = props.generatedImage || props.baseImage
      if (initialImage && typeof initialImage === 'string') {
        loadImageToCanvas(initialImage)
      }
    })

    return {
      // Refs
      baseCanvasRef,
      maskCanvasRef,
      canvasWidth,
      canvasHeight,

      // Composables
      canvasControls,
      canvasDrawing,

      // Estado
      isAnyToolActive,
      isGridVisible,

      // Handlers
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleDrawStart,
      handleDraw,
      handleDrawEnd,

      // Métodos
      clearMask,
      getMaskDataUrl,
      hasMaskDrawing,
      toggleGrid
    }
  }
}
</script>

<style scoped>
.canvas-container {
  min-height: 400px;
  user-select: none;
  padding: 20px; /* Reduzido para facilitar visualização do zoom */
  overflow: visible; /* Garante que o zoom seja visível */
}

.canvas-wrapper {
  transition: transform 0.05s ease-out;
  transform-origin: center center;
}

/* Cursores personalizados */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.cursor-default {
  cursor: default;
}

/* Desabilita seleção de texto durante interação */
.canvas-container * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

/* Grade overlay */
.grid-overlay {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 10;
}
</style>