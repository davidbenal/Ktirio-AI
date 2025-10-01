import { ref, computed } from 'vue'

/**
 * Composable para gerenciamento de estado da interface do editor
 *
 * Funcionalidades:
 * - Ferramentas ativas (desenho, seleção)
 * - Configurações do brush (tamanho, modo)
 * - Visibilidade das sidebars
 * - Estado de modais de edição
 * - Nome do projeto
 * - Computações de estado derivado
 */
export function useEditorState(initialProjectName) {
  // ========== ESTADOS DAS FERRAMENTAS ==========
  const brushSize = ref(44) // Tamanho do pincel (5-100px)
  const activeTool = ref(null) // Ferramenta selecionada ('draw' | 'select' | null)

  // ========== ESTADOS DOS MODAIS ==========
  const isEditModalOpen = ref(false) // Modal de edição ativo?
  const editModalPosition = ref(null) // Posição do modal { x, y }

  // ========== ESTADOS DAS SIDEBARS ==========
  const isLeftSidebarVisible = ref(true) // Sidebar esquerda visível?
  const isRightSidebarVisible = ref(true) // Sidebar direita visível?

  // ========== ESTADO DO PROJETO ==========
  const projectName = ref(initialProjectName || 'Novo Projeto') // Nome editável do projeto

  // ========== COMPUTED PROPERTIES ==========
  const isAnyToolActive = computed(() => activeTool.value !== null)
  const isDrawToolActive = computed(() => activeTool.value === 'draw')
  const isSelectToolActive = computed(() => activeTool.value === 'select')

  // ========== HANDLERS DAS FERRAMENTAS ==========

  /**
   * Seleciona ferramenta específica
   * Se já estiver ativa, desativa. Se não, ativa
   */
  const handleToolSelect = (tool) => {
    if (activeTool.value === tool) {
      // Se ferramenta já estiver ativa, desativa
      activeTool.value = null
    } else {
      // Ativa ferramenta selecionada
      activeTool.value = tool
    }
  }

  /**
   * Define ferramenta específica
   */
  const setActiveTool = (tool) => {
    activeTool.value = tool
  }

  /**
   * Limpa seleção de ferramenta
   */
  const clearActiveTool = () => {
    activeTool.value = null
  }

  // ========== HANDLERS DOS MODAIS ==========

  /**
   * Manipula fim do desenho - detecta se deve abrir modal de edição
   *
   * Fluxo:
   * 1. Verifica se ferramenta 'select' está ativa
   * 2. Analisa se algo foi desenhado no canvas de máscara
   * 3. Se houver desenho, abre modal na posição do mouse
   * 4. Modal permite editar prompt específico para área selecionada
   */
  const handleDrawingStop = (event, maskCanvas) => {
    if (activeTool.value === 'select' && maskCanvas) {
      const ctx = maskCanvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      // Verifica se há pixels desenhados na máscara
      const imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
      const pixelBuffer = new Uint32Array(imageData.data.buffer)
      const hasDrawing = pixelBuffer.some(color => color !== 0)

      if (hasDrawing) {
        editModalPosition.value = { x: event.clientX, y: event.clientY }
        isEditModalOpen.value = true
      }
    }
  }

  /**
   * Aplica edição do modal e chama geração da IA
   * Fecha modal e executa função de geração com prompt customizado
   */
  const handleApplyEdit = async (modalPrompt, modalObjectImages, generateFunction) => {
    isEditModalOpen.value = false
    if (generateFunction) {
      await generateFunction(modalPrompt, modalObjectImages)
    }
  }

  /**
   * Cancela edição e limpa máscara desenhada
   * Fecha modal sem aplicar mudanças e remove seleção do canvas
   */
  const handleCancelEdit = (clearMaskFunction) => {
    isEditModalOpen.value = false
    if (clearMaskFunction) {
      clearMaskFunction()
    }
  }

  // ========== HANDLERS DAS SIDEBARS ==========

  /**
   * Alterna visibilidade da sidebar esquerda
   * Contém controles de projeto, upload, prompt e referências
   */
  const toggleLeftSidebar = () => {
    isLeftSidebarVisible.value = !isLeftSidebarVisible.value
  }

  /**
   * Alterna visibilidade da sidebar direita
   * Contém histórico de versões do projeto
   */
  const toggleRightSidebar = () => {
    isRightSidebarVisible.value = !isRightSidebarVisible.value
  }

  // ========== HANDLERS DO BRUSH ==========

  /**
   * Define tamanho do brush com validação
   */
  const setBrushSize = (size) => {
    brushSize.value = Math.max(1, Math.min(100, size))
  }


  // ========== HANDLERS DO PROJETO ==========

  /**
   * Atualiza nome do projeto
   */
  const setProjectName = (name) => {
    projectName.value = name
  }

  // ========== RESET E INICIALIZAÇÃO ==========

  /**
   * Reseta estados para novo projeto
   */
  const resetForNewProject = (newProjectName) => {
    activeTool.value = null
    brushSize.value = 44
    isEditModalOpen.value = false
    editModalPosition.value = null
    projectName.value = newProjectName || 'Novo Projeto'
  }

  /**
   * Reseta apenas estados de UI (mantém projeto)
   */
  const resetUI = () => {
    activeTool.value = null
    isEditModalOpen.value = false
    editModalPosition.value = null
  }

  return {
    // ========== ESTADOS EXPORTADOS ==========

    // Estados das ferramentas
    brushSize,
    activeTool,

    // Estados dos modais
    isEditModalOpen,
    editModalPosition,

    // Estados das sidebars
    isLeftSidebarVisible,
    isRightSidebarVisible,

    // Estado do projeto
    projectName,

    // ========== COMPUTED EXPORTADOS ==========
    isAnyToolActive,
    isDrawToolActive,
    isSelectToolActive,

    // ========== HANDLERS EXPORTADOS ==========

    // Handlers das ferramentas
    handleToolSelect,
    setActiveTool,
    clearActiveTool,

    // Handlers dos modais
    handleDrawingStop,
    handleApplyEdit,
    handleCancelEdit,

    // Handlers das sidebars
    toggleLeftSidebar,
    toggleRightSidebar,

    // Handlers do brush
    setBrushSize,

    // Handlers do projeto
    setProjectName,

    // Reset e inicialização
    resetForNewProject,
    resetUI
  }
}