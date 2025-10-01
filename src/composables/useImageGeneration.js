import { ref, computed } from 'vue'
import { editImageWithMask } from '../services/geminiService.js'

/**
 * Composable para geração de imagens com IA (Gemini)
 *
 * Gerencia:
 * - Geração de imagens com IA
 * - Histórico de versões
 * - Imagens de referência
 * - Estados de loading/erro
 * - Download de imagens
 */
export function useImageGeneration(initialHistory = []) {
  // ========== ESTADOS DE IMAGENS ==========
  const baseImage = ref(null)
  const generatedImage = ref(
    initialHistory.length > 0 ? initialHistory[initialHistory.length - 1] : null
  )
  const fixedDimensions = ref({ width: null, height: null }) // Armazena dimensões fixas

  // ========== ESTADOS DE PROMPT E REFERÊNCIAS ==========
  const prompt = ref('')
  const objectImages = ref([])

  // ========== ESTADOS DE CONTROLE ==========
  const isLoading = ref(false) // SEMPRE inicia como false
  const error = ref(null)

  // ========== HISTÓRICO ==========
  const history = ref([...initialHistory])

  // ========== COMPUTED ==========
  const currentImage = computed(() => generatedImage.value || baseImage.value)
  const hasImages = computed(() => !!currentImage.value)
  const canGenerate = computed(() =>
    !!baseImage.value && !!prompt.value.trim() && !isLoading.value
  )

  // ========== HANDLERS DE IMAGENS ==========

  /**
   * Define nova imagem base e reseta projeto
   */
  const setNewBaseImage = (imageUrl) => {
    baseImage.value = imageUrl
    generatedImage.value = null
    history.value = []
    objectImages.value = []
    error.value = null
    fixedDimensions.value = { width: null, height: null } // Reseta dimensões fixas
  }

  /**
   * Adiciona imagem de referência
   */
  const addReferenceImage = (referenceImage) => {
    objectImages.value.push(referenceImage)
  }

  /**
   * Remove imagem de referência
   */
  const removeReferenceImage = (imageId) => {
    objectImages.value = objectImages.value.filter(img => img.id !== imageId)
  }

  /**
   * Limpa todas as imagens de referência
   */
  const clearReferenceImages = () => {
    objectImages.value = []
  }

  // ========== GERAÇÃO COM IA ==========

  /**
   * Gera nova imagem usando Gemini AI
   */
  const generateImage = async (maskDataUrl) => {
    if (!canGenerate.value) {
      throw new Error('Condições insuficientes para gerar imagem')
    }

    const imageToUse = currentImage.value
    if (!imageToUse) {
      throw new Error('Nenhuma imagem base disponível')
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await editImageWithMask(
        imageToUse,
        maskDataUrl,
        prompt.value.trim(),
        objectImages.value
      )

      if (result.image) {
        const newImageDataUrl = `data:image/png;base64,${result.image}`

        // Adiciona ao histórico
        history.value.push(newImageDataUrl)

        // Define como imagem atual
        generatedImage.value = newImageDataUrl

        // Limpa prompt usado
        prompt.value = ''

        return {
          image: newImageDataUrl,
          text: result.text
        }
      } else {
        throw new Error('IA não retornou uma imagem')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Gera nova imagem usando imagem combinada (com máscara visível)
   */
  const generateImageWithCombined = async (combinedImage, maskDataUrl) => {
    if (!canGenerate.value) {
      throw new Error('Condições insuficientes para gerar imagem')
    }

    if (!combinedImage) {
      throw new Error('Nenhuma imagem combinada disponível')
    }

    const imageToUse = currentImage.value
    if (!imageToUse) {
      throw new Error('Nenhuma imagem base disponível')
    }

    isLoading.value = true
    error.value = null

    try {
      // Envia tanto a imagem original quanto a combinada (com máscara)
      const result = await editImageWithMask(
        imageToUse, // Imagem original limpa
        maskDataUrl,
        prompt.value.trim(),
        objectImages.value,
        combinedImage // Imagem com máscara verde visível
      )

      if (result.image) {
        const newImageDataUrl = `data:image/png;base64,${result.image}`

        // Adiciona ao histórico
        history.value.push(newImageDataUrl)

        // Define como imagem atual
        generatedImage.value = newImageDataUrl

        // Limpa prompt usado
        prompt.value = ''

        return {
          image: newImageDataUrl,
          text: result.text
        }
      } else {
        throw new Error('IA não retornou uma imagem')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ========== HISTÓRICO ==========

  /**
   * Volta para versão anterior
   */
  const goToPreviousVersion = () => {
    if (history.value.length > 1) {
      history.value.pop()
      generatedImage.value = history.value[history.value.length - 1]
    } else if (history.value.length === 1) {
      history.value = []
      generatedImage.value = null
    }
  }

  /**
   * Seleciona versão específica do histórico
   */
  const selectVersion = (index) => {
    if (index === -1) {
      // Volta para a imagem base (original)
      generatedImage.value = null
    } else if (index >= 0 && index < history.value.length) {
      // Navega para versão específica (sem remover versões posteriores)
      generatedImage.value = history.value[index]
    }
  }

  /**
   * Limpa todo o histórico
   */
  const clearHistory = () => {
    history.value = []
    generatedImage.value = null
  }

  // ========== DOWNLOAD ==========

  /**
   * Baixa imagem atual
   */
  const downloadCurrentImage = (filename = 'ktirio-image') => {
    const image = currentImage.value
    if (!image) return

    const link = document.createElement('a')
    link.href = image
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ========== UTILIDADES ==========

  /**
   * Reseta todos os estados
   */
  const reset = () => {
    isLoading.value = false // PRIMEIRO garante que não está carregando
    baseImage.value = null
    generatedImage.value = null
    prompt.value = ''
    objectImages.value = []
    history.value = []
    error.value = null
    fixedDimensions.value = { width: null, height: null } // Reseta dimensões fixas
  }

  /**
   * Detecta dimensões de uma imagem automaticamente
   */
  const detectImageDimensions = (imageUrl) => {
    const img = new Image()
    img.onload = () => {
      fixedDimensions.value = { width: img.width, height: img.height }
    }
    img.src = imageUrl
  }

  /**
   * Carrega estado a partir de projeto existente
   */
  const loadFromProject = (project) => {
    isLoading.value = false

    if (!project) {
      return
    }

    baseImage.value = project.baseImage || null
    history.value = [...(project.history || [])]
    generatedImage.value = history.value.length > 0
      ? history.value[history.value.length - 1]
      : null
    error.value = null

    // Carrega dimensões fixas salvas ou detecta automaticamente
    if (project.fixedDimensions) {
      fixedDimensions.value = { ...project.fixedDimensions }
    } else if (project.baseImage) {
      // Se não tem dimensões salvas, detecta da imagem base
      detectImageDimensions(project.baseImage)
    }
  }

  return {
    // Estados
    baseImage,
    generatedImage,
    prompt,
    objectImages,
    isLoading,
    error,
    history,
    fixedDimensions,

    // Computed
    currentImage,
    hasImages,
    canGenerate,

    // Métodos de imagem
    setNewBaseImage,
    addReferenceImage,
    removeReferenceImage,
    clearReferenceImages,

    // Geração IA
    generateImage,
    generateImageWithCombined,

    // Histórico
    goToPreviousVersion,
    selectVersion,
    clearHistory,

    // Download
    downloadCurrentImage,

    // Utilidades
    reset,
    loadFromProject
  }
}