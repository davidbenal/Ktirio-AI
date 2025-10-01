<template>
  <Transition name="sidebar-right">
    <aside
      v-if="isVisible"
      class="w-80 bg-white text-gray-900 p-6 overflow-y-auto border-l border-gray-200 relative z-10"
    >
    <!-- Header da Sidebar -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Histórico</h2>
      <button
        @click="$emit('toggle')"
        class="text-gray-500 hover:text-gray-700 text-lg"
        title="Recolher sidebar"
      >
        →
      </button>
    </div>

    <!-- Histórico de Versões -->
    <div>
      <div v-if="history.length === 0" class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">📝</div>
        <p class="text-sm">Nenhuma versão gerada ainda</p>
        <p class="text-xs mt-1">
          Use as ferramentas para criar sua primeira versão
        </p>
      </div>

      <div v-else class="space-y-3">
        <!-- Imagem base (se existir) -->
        <div
          v-if="baseImage"
          class="relative cursor-pointer"
          :class="{ 'ring-2 ring-blue-500': isBaseImageCurrent }"
          @click="$emit('select-version', -1)"
        >
          <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors">
            <img
              :src="baseImage"
              alt="Imagem base"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
            Original
          </div>

          <div v-if="isBaseImageCurrent" class="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs text-white">
            Atual
          </div>
        </div>

        <!-- Versões geradas -->
        <div
          v-for="(version, index) in history"
          :key="index"
          class="relative cursor-pointer"
          :class="{ 'ring-2 ring-blue-500': isCurrentVersion(index) }"
          @click="$emit('select-version', index)"
        >
          <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors">
            <img
              :src="version"
              :alt="`Versão ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="absolute top-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
            v{{ index + 1 }}
          </div>

          <div v-if="isCurrentVersion(index)" class="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs text-white">
            Atual
          </div>
        </div>
      </div>
    </div>
    </aside>
  </Transition>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'RightSidebar',
  props: {
    isVisible: {
      type: Boolean,
      default: true
    },
    baseImage: {
      type: String,
      default: null
    },
    history: {
      type: Array,
      default: () => []
    },
    currentImage: {
      type: String,
      default: null
    }
  },
  emits: [
    'toggle',
    'select-version',
    'create-from-version'
  ],
  setup(props) {
    const isBaseImageCurrent = computed(() => {
      // Se currentImage é igual à baseImage, a base está atual
      // Se currentImage é null (gerada foi resetada), também volta para base
      return !props.currentImage || props.currentImage === props.baseImage
    })

    const isCurrentVersion = (index) => {
      // Compara se a versão no índice é igual à currentImage
      return props.currentImage === props.history[index]
    }

    return {
      isBaseImageCurrent,
      isCurrentVersion
    }
  }
}
</script>

<style scoped>
/* Scrollbar personalizada */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #f9fafb;
}

aside::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Transições suaves para as imagens */
.aspect-video img {
  transition: transform 0.2s ease;
}

/* Animações da sidebar direita */
.sidebar-right-enter-active,
.sidebar-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-right-enter-from {
  transform: translateX(100%);
}

.sidebar-right-leave-to {
  transform: translateX(100%);
}
</style>