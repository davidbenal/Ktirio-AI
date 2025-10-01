<template>
  <div
    ref="toolbarRef"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      zIndex: 1000
    }"
    class="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-3 cursor-move select-none"
    @mousedown="startDrag"
  >
    <!-- Handle para arrastar -->
    <div class="flex items-center justify-center mb-2">
      <div class="w-8 h-1 bg-gray-300 rounded-full"></div>
    </div>

    <!-- Ferramentas -->
    <div class="flex gap-2">
      <!-- Lápis -->
      <button
        @click.stop="handleToolSelect('draw')"
        :class="getToolButtonClass('draw')"
        title="Ferramenta de Lápis"
      >
        <PaintBrushIcon size="20" />
        <span class="text-sm mt-1">Lápis</span>
      </button>

      <!-- Ferramenta de Borracha -->
      <button
        @click.stop="handleToolSelect('remove')"
        :class="getToolButtonClass('remove')"
        title="Ferramenta de Borracha"
      >
        <RemoveIcon size="20" />
        <span class="text-sm mt-1">Borracha</span>
      </button>

      <!-- Régua -->
      <button
        @click.stop="handleToolSelect('ruler')"
        :class="getToolButtonClass('ruler')"
        title="Ferramenta de Medição"
      >
        <RulerIcon size="20" />
        <span class="text-sm mt-1">Régua</span>
      </button>
    </div>

    <!-- Tamanho do Pincel -->
    <div class="mt-3 px-1">
      <label class="block text-xs font-medium mb-1 text-gray-700 text-center">
        Tamanho: {{ brushSize }}px
      </label>
      <input
        type="range"
        min="5"
        max="100"
        :value="brushSize"
        @input="$emit('brush-size-change', $event.target.value)"
        @click.stop
        class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PaintBrushIcon,
  RemoveIcon,
  RulerIcon
} from './icons.vue'

export default {
  name: 'FloatingToolbar',
  components: {
    PaintBrushIcon,
    RemoveIcon,
    RulerIcon
  },
  props: {
    brushSize: {
      type: Number,
      default: 44
    },
    activeTool: {
      type: String,
      default: null
    }
  },
  emits: [
    'tool-select',
    'brush-size-change'
  ],
  setup(props, { emit }) {
    const toolbarRef = ref(null)
    const position = ref({ x: 0, y: 0 })
    const isDragging = ref(false)
    const dragOffset = ref({ x: 0, y: 0 })

    // ========== COMPUTED ==========
    const getToolButtonClass = (toolName) => {
      const isActive = props.activeTool === toolName
      return [
        'flex flex-col items-center p-3 rounded-lg border-2 transition-all min-h-[70px] min-w-[60px]',
        isActive
          ? 'border-blue-500 bg-blue-50 text-blue-600'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
      ]
    }

    // ========== DRAG FUNCTIONALITY ==========
    const startDrag = (event) => {
      if (event.target.type === 'range') return // Não arrastar quando interagindo com o slider

      isDragging.value = true
      const rect = toolbarRef.value.getBoundingClientRect()
      dragOffset.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }

      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      event.preventDefault()
    }

    const onDrag = (event) => {
      if (!isDragging.value) return

      const newX = event.clientX - dragOffset.value.x
      const newY = event.clientY - dragOffset.value.y

      // Limitar dentro da viewport
      const maxX = window.innerWidth - toolbarRef.value.offsetWidth
      const maxY = window.innerHeight - toolbarRef.value.offsetHeight

      position.value.x = Math.max(0, Math.min(newX, maxX))
      position.value.y = Math.max(0, Math.min(newY, maxY))
    }

    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    // ========== HANDLERS ==========
    const handleToolSelect = (toolName) => {
      emit('tool-select', toolName)
    }

    // ========== LIFECYCLE ==========
    onMounted(() => {
      // Posicionar no centro inferior da tela
      const centerX = (window.innerWidth - 250) / 2 // aproximadamente a largura da toolbar horizontal
      const bottomY = window.innerHeight - 150 // 150px do bottom

      position.value = { x: centerX, y: bottomY }
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
    })

    return {
      toolbarRef,
      position,
      getToolButtonClass,
      startDrag,
      handleToolSelect
    }
  }
}
</script>

<style scoped>
/* Estilização do slider */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

/* Prevenir seleção de texto durante drag */
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Efeito visual durante hover */
.cursor-move:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>