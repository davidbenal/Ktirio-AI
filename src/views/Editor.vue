<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <div class="flex flex-col h-screen">
      <!-- Header -->
      <header class="bg-gray-950 px-6 py-4 flex justify-between items-center border-b border-gray-800 relative z-20">
        <div class="flex items-center">
          <button
            @click="goBackToGallery"
            class="text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            ← Voltar
          </button>
        </div>

        <div class="flex-1 flex justify-center">
          <h1 class="text-lg font-semibold text-white tracking-tight">
            {{ editorState.projectName }}
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Controles de Sidebar -->
          <button
            @click="editorState.toggleLeftSidebar"
            :class="[
              'p-3 rounded-lg transition-all duration-200',
              editorState.isLeftSidebarVisible
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
            title="Mostrar/Ocultar Projeto"
          >
            <ToolsIcon size="16" />
          </button>

          <button
            @click="editorState.toggleRightSidebar"
            :class="[
              'p-3 rounded-lg transition-all duration-200',
              editorState.isRightSidebarVisible
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
            title="Mostrar/Ocultar Histórico"
          >
            <HistoryIcon size="16" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar -->
        <Sidebar
          :is-visible="editorState.isLeftSidebarVisible.value"
          :prompt="imageGeneration.prompt.value"
          :current-image="imageGeneration.currentImage.value"
          :is-generating="imageGeneration.isLoading.value"
          :history-count="imageGeneration.history.value.length"
          @toggle="editorState.toggleLeftSidebar"
          @file-upload="handleFileUpload"
          @remove-image="removeImage"
          @prompt-change="updatePrompt"
          @generate-image="generateImage"
        />

        <!-- Canvas Area -->
        <main class="flex-1 flex items-center justify-center bg-gray-100 relative">
          <!-- Canvas sempre visível -->
          <Canvas
            ref="canvasRef"
            :base-image="imageGeneration.baseImage.value"
            :generated-image="imageGeneration.generatedImage.value"
            :brush-size="editorState.brushSize.value"
            :active-tool="editorState.activeTool.value"
            :is-generating="imageGeneration.isLoading.value"
            :fixed-dimensions="imageGeneration.fixedDimensions.value"
            @drawing-stop="handleDrawingStop"
            @dimensions-set="handleDimensionsSet"
          />

          <!-- Instrução para upload se não houver imagem -->
          <div
            v-if="!imageGeneration.hasImages.value"
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div class="text-center max-w-md bg-white border border-gray-100 rounded-xl p-8 pointer-events-auto shadow-lg">
              <div class="text-4xl mb-6">🎨</div>
              <h2 class="text-lg font-semibold mb-4 text-gray-900">Bem-vindo ao Editor</h2>
              <p class="text-gray-600 mb-8 text-sm leading-relaxed">
                Carregue uma imagem na sidebar esquerda para começar a editar
              </p>
              <button
                @click="editorState.toggleLeftSidebar"
                class="bg-gray-950 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Abrir Ferramentas
              </button>
            </div>
          </div>
        </main>

        <!-- Right Sidebar -->
        <RightSidebar
          :is-visible="editorState.isRightSidebarVisible.value"
          :base-image="imageGeneration.baseImage.value"
          :history="imageGeneration.history.value"
          :current-image="imageGeneration.currentImage.value"
          @toggle="editorState.toggleRightSidebar"
          @select-version="selectVersion"
          @create-from-version="createFromVersion"
        />
      </div>
    </div>

    <!-- Loading Modal Global -->
    <LoadingModal
      :is-open="imageGeneration.isLoading.value"
      title="Gerando imagem com IA"
      message="Aguarde enquanto processamos sua solicitação..."
      :show-cancel="false"
    />

    <!-- Floating Toolbar -->
    <FloatingToolbar
      :brush-size="editorState.brushSize.value"
      :active-tool="editorState.activeTool.value"
      @tool-select="editorState.handleToolSelect"
      @brush-size-change="editorState.setBrushSize"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '../stores/projects.js'
import { useNavigationStore } from '../stores/navigation.js'
import { useEditorState } from '../composables/useEditorState.js'
import { useImageGeneration } from '../composables/useImageGeneration.js'

// Componentes
import Canvas from '../components/Canvas.vue'
import Sidebar from '../components/Sidebar.vue'
import RightSidebar from '../components/RightSidebar.vue'
import LoadingModal from '../components/LoadingModal.vue'
import FloatingToolbar from '../components/FloatingToolbar.vue'

// Ícones
import { ToolsIcon, HistoryIcon } from '../components/icons.vue'

export default {
  name: 'Editor',
  components: {
    Canvas,
    Sidebar,
    RightSidebar,
    LoadingModal,
    FloatingToolbar,
    ToolsIcon,
    HistoryIcon
  },
  setup() {
    const route = useRoute()
    const projectsStore = useProjectsStore()
    const navigationStore = useNavigationStore()

    // ========== REFS ==========
    const canvasRef = ref(null)

    // ========== COMPUTED ==========
    const currentProject = computed(() => projectsStore.currentProject)

    // ========== COMPOSABLES ==========
    const editorState = useEditorState(currentProject.value?.name)
    const imageGeneration = useImageGeneration(currentProject.value?.history)

    // Força isLoading para false na inicialização
    imageGeneration.isLoading.value = false

    // ========== WATCHERS ==========

    // Sincroniza projeto atual quando mudança de rota
    watch(() => route.params.projectId, (projectId) => {
      if (projectId) {
        projectsStore.setCurrentProjectId(projectId)
      }
    }, { immediate: true })

    // Carrega projeto no imageGeneration quando projeto muda
    watch(currentProject, (project) => {
      if (project) {
        imageGeneration.loadFromProject(project)
        editorState.setProjectName(project.name)
      }
    }, { immediate: true })

    // ========== HANDLERS ==========

    const goBackToGallery = () => {
      // Salva mudanças no projeto antes de sair
      if (currentProject.value) {
        const updatedProject = {
          ...currentProject.value,
          name: editorState.projectName.value,
          baseImage: imageGeneration.baseImage.value,
          history: imageGeneration.history.value,
          fixedDimensions: imageGeneration.fixedDimensions.value
        }
        projectsStore.updateProject(updatedProject)
      }
      navigationStore.goToGallery()
    }


    const clearMask = () => {
      canvasRef.value?.clearMask()
    }

    const handleFileUpload = (dataUrl) => {
      console.log('handleFileUpload chamado com dataUrl:', dataUrl.substring(0, 50) + '...')
      imageGeneration.setNewBaseImage(dataUrl)
      console.log('Após setNewBaseImage:')
      console.log('- baseImage:', imageGeneration.baseImage.value ? 'Definido' : 'Null')
      console.log('- generatedImage:', imageGeneration.generatedImage.value ? 'Definido' : 'Null')
      console.log('- currentImage:', imageGeneration.currentImage.value ? 'Definido' : 'Null')

      // Atualiza projeto
      if (currentProject.value) {
        const updatedProject = {
          ...currentProject.value,
          baseImage: dataUrl,
          fixedDimensions: null // Reseta dimensões para nova imagem base
        }
        projectsStore.updateProject(updatedProject)
      }
    }

    const removeImage = () => {
      imageGeneration.reset()
      if (currentProject.value) {
        const updatedProject = {
          ...currentProject.value,
          baseImage: null,
          history: []
        }
        projectsStore.updateProject(updatedProject)
      }
    }

    const updatePrompt = (newPrompt) => {
      imageGeneration.prompt.value = newPrompt
    }

    const generateImage = async () => {
      if (!canvasRef.value?.hasMaskDrawing()) {
        alert('Desenhe uma área para editar antes de gerar')
        return
      }

      try {
        // Obtém a imagem combinada (base + máscara verde visível)
        const combinedImage = canvasRef.value.getCombinedImageWithMask()
        const maskDataUrl = canvasRef.value.getMaskDataUrl()

        // Envia a imagem combinada em vez da imagem base sozinha
        const result = await imageGeneration.generateImageWithCombined(combinedImage, maskDataUrl)

        // Limpa máscara após gerar
        clearMask()

        // Atualiza projeto com nova versão
        if (currentProject.value) {
          const updatedProject = {
            ...currentProject.value,
            history: imageGeneration.history.value,
            fixedDimensions: imageGeneration.fixedDimensions.value
          }
          projectsStore.updateProject(updatedProject)
        }

        console.log('Imagem gerada:', result.text)
      } catch (error) {
        console.error('Erro ao gerar imagem:', error)
        alert('Erro ao gerar imagem: ' + error.message)
      }
    }

    const handleDrawingStop = (event) => {
      editorState.handleDrawingStop(event, canvasRef.value?.maskCanvasRef)
    }

    const handleDimensionsSet = (dimensions) => {
      imageGeneration.fixedDimensions.value = dimensions

      // Salva as dimensões no projeto para uso futuro
      if (currentProject.value) {
        const updatedProject = {
          ...currentProject.value,
          fixedDimensions: dimensions
        }
        projectsStore.updateProject(updatedProject)
      }
    }

    // ========== HANDLERS DO PROJETO ==========

    const selectVersion = (index) => {
      imageGeneration.selectVersion(index)
    }

    const createFromVersion = (imageUrl) => {
      if (currentProject.value) {
        const newProject = projectsStore.createNewProjectFromVersion(currentProject.value, imageUrl)
        navigationStore.navigateToProject(newProject.id)
      }
    }


    // ========== LIFECYCLE ==========

    onMounted(() => {
      // Carrega projeto se disponível
      const projectId = route.params.projectId
      if (projectId) {
        projectsStore.setCurrentProjectId(projectId)
      }
    })

    return {
      // Refs
      canvasRef,

      // Computed
      currentProject,

      // Composables
      editorState,
      imageGeneration,

      // Handlers
      goBackToGallery,
      clearMask,
      handleFileUpload,
      removeImage,
      updatePrompt,
      generateImage,
      handleDrawingStop,
      handleDimensionsSet,

      // Handlers do projeto
      selectVersion,
      createFromVersion,

    }
  }
}
</script>

<style scoped>
/* Garantir que o layout funcione corretamente */
.min-h-screen {
  min-height: 100vh;
}

/* Scrollbar personalizada para sidebars */
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
</style>