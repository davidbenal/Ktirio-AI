/**
 * @typedef {Object} Project
 * @property {string} id - ID único do projeto
 * @property {string} name - Nome do projeto
 * @property {string|null} baseImage - URL da imagem base
 * @property {string} createdAt - Data de criação
 * @property {string} updatedAt - Data de última atualização
 * @property {boolean} isFavorite - Se o projeto está marcado como favorito
 * @property {boolean} isArchived - Se o projeto está arquivado
 * @property {HistoryEntry[]} history - Histórico de edições
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id - ID único da entrada no histórico
 * @property {string} imageUrl - URL da imagem gerada
 * @property {string} prompt - Prompt usado para gerar a imagem
 * @property {string} maskDataUrl - Dados da máscara usada
 * @property {string} timestamp - Timestamp da criação
 */

/**
 * @typedef {Object} Folder
 * @property {string} id - ID único da pasta
 * @property {string} name - Nome da pasta
 * @property {string} color - Cor da pasta
 * @property {string} createdAt - Data de criação
 */

/**
 * Enum para tipos de ferramentas
 * @readonly
 * @enum {string}
 */
export const ToolType = {
  SELECT: 'select',
  BRUSH: 'brush',
  ERASER: 'eraser'
}

/**
 * Enum para modos do brush
 * @readonly
 * @enum {string}
 */
export const BrushMode = {
  Draw: 'draw',
  Erase: 'erase'
}

/**
 * Configurações padrão do editor
 */
export const EditorDefaults = {
  BRUSH_SIZE: 20,
  CANVAS_MAX_WIDTH: 1024,
  CANVAS_MAX_HEIGHT: 768
}