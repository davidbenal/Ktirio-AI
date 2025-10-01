<template>
  <Transition name="sidebar-left">
    <aside
      v-if="isVisible"
      class="w-80 bg-white text-gray-900 p-6 overflow-y-auto border-r border-gray-200 relative z-10"
    >
    <!-- Header da Sidebar -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Projeto</h2>
      <button
        @click="$emit('toggle')"
        class="text-gray-500 hover:text-gray-700 text-lg"
        title="Recolher sidebar"
      >
        ←
      </button>
    </div>

    <!-- Upload de Imagem (apenas se não houver imagem) -->
    <div v-if="!currentImage" class="mb-8">
      <h3 class="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
        Imagem Base
      </h3>

      <div class="space-y-3">
        <!-- Área de Upload -->
        <div
          @drop="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          @click="triggerFileInput"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />

          <div class="flex flex-col items-center">
            <span class="text-2xl mb-2">📷</span>
            <p class="text-sm text-gray-600">
              Clique ou arraste uma imagem
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview da Imagem (apenas se houver imagem) -->
    <div v-if="currentImage" class="mb-8">
      <h3 class="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
        Imagem Base
      </h3>

      <div class="relative">
        <img
          :src="currentImage"
          alt="Imagem atual"
          class="w-full h-32 object-cover rounded-lg"
        />
        <button
          @click="$emit('remove-image')"
          class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
          title="Remover imagem"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Prompt da IA -->
    <div class="mb-8">
      <h3 class="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
        Prompt da IA
      </h3>

      <textarea
        :value="prompt"
        @input="$emit('prompt-change', $event.target.value)"
        class="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm resize-none focus:border-blue-500 focus:outline-none"
        placeholder="Descreva as mudanças que deseja aplicar..."
      ></textarea>

      <button
        @click="$emit('generate-image')"
        :disabled="!canGenerate"
        :class="[
          'w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all',
          canGenerate
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ isGenerating ? 'Gerando...' : 'Gerar com IA' }}
      </button>
    </div>

    <!-- Informações do Projeto -->
    <div>
      <h3 class="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
        Projeto
      </h3>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Status:</span>
          <span class="text-green-600">Ativo</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Versões:</span>
          <span class="text-gray-700">{{ historyCount || 0 }}</span>
        </div>
      </div>
    </div>
    </aside>
  </Transition>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Sidebar',
  components: {},
  props: {
    isVisible: {
      type: Boolean,
      default: true
    },
    prompt: {
      type: String,
      default: ''
    },
    currentImage: {
      type: String,
      default: null
    },
    isGenerating: {
      type: Boolean,
      default: false
    },
    historyCount: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'toggle',
    'file-upload',
    'remove-image',
    'prompt-change',
    'generate-image'
  ],
  setup(props, { emit }) {
    const fileInputRef = ref(null)

    // ========== COMPUTED ==========

    const canGenerate = computed(() =>
      props.currentImage && typeof props.prompt === 'string' && props.prompt.trim() && !props.isGenerating
    )

    // ========== HANDLERS ==========

    const triggerFileInput = () => {
      fileInputRef.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        handleFile(file)
      }
    }

    const handleFileDrop = (event) => {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        handleFile(file)
      }
    }

    const handleFile = (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        emit('file-upload', e.target.result)
      }
      reader.readAsDataURL(file)
    }

    return {
      fileInputRef,
      canGenerate,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop
    }
  }
}
</script>

<style scoped>
/* Estilização do slider */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

/* Scrollbar personalizada */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #374151;
}

aside::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animações da sidebar esquerda */
.sidebar-left-enter-active,
.sidebar-left-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-left-enter-from {
  transform: translateX(-100%);
}

.sidebar-left-leave-to {
  transform: translateX(-100%);
}
</style>