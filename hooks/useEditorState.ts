import { useState, useCallback, useRef } from 'react';
import { BrushMode, ReferenceImage } from '../types';

export type ActiveTool = 'draw' | 'select';

/**
 * useEditorState - Gerenciamento de estado da interface do editor
 *
 * Este hook centraliza toda lógica de estado da UI:
 * - Ferramentas ativas (desenho, seleção)
 * - Configurações do brush (tamanho, modo)
 * - Visibilidade das sidebars
 * - Estado de modais de edição
 * - Nome do projeto
 * - Computações de estado derivado
 *
 * Uso: const editorState = useEditorState(project.name);
 */
export const useEditorState = (initialProjectName: string) => {
  // ========== ESTADOS DAS FERRAMENTAS ==========
  const [brushSize, setBrushSize] = useState<number>(44);              // Tamanho do pincel (5-100px)
  const [brushMode, setBrushMode] = useState<BrushMode>(BrushMode.Draw); // Modo desenho/apagador
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(null); // Ferramenta selecionada

  // ========== ESTADOS DOS MODAIS ==========
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);        // Modal de edição ativo?
  const [editModalPosition, setEditModalPosition] = useState<{ x: number, y: number } | null>(null); // Posição do modal

  // ========== ESTADOS DAS SIDEBARS ==========
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState<boolean>(true);  // Sidebar esquerda visível?
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState<boolean>(true); // Sidebar direita visível?

  // ========== ESTADO DO PROJETO ==========
  const [projectName, setProjectName] = useState<string>(initialProjectName);     // Nome editável do projeto

  // ========== HANDLERS DAS FERRAMENTAS ==========

  /**
   * Seleciona/deseleciona ferramenta ativa
   * Se clicar na mesma ferramenta, deseleciona (volta para navegação)
   * Usado nos botões de desenho e seleção
   */
  const handleToolSelect = useCallback((tool: ActiveTool) => {
    setActiveTool(prev => prev === tool ? null : tool);
  }, []);

  /**
   * Alterna entre modo desenho e apagador
   * Usado no botão de borracha (EraserIcon)
   * Não afeta qual ferramenta está ativa, apenas o comportamento do brush
   */
  const toggleBrushMode = useCallback(() => {
    setBrushMode(prev => prev === BrushMode.Draw ? BrushMode.Erase : BrushMode.Draw);
  }, []);

  // ========== HANDLERS DOS MODAIS ==========

  /**
   * Manipula fim do desenho - detecta se deve abrir modal de edição
   *
   * Fluxo:
   * 1. Verifica se ferramenta 'select' está ativa
   * 2. Analisa se algo foi desenhado no canvas de máscara
   * 3. Se houver desenho, abre modal na posição do mouse
   * 4. Modal permite editar prompt específico para área selecionada
   *
   * @param event - Evento de mouse para capturar posição
   * @param maskCanvasRef - Referência ao canvas da máscara
   */
  const handleDrawingStop = useCallback((
    event: MouseEvent,
    maskCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => {
    if (activeTool === 'select') {
      const mask = maskCanvasRef.current;
      if (mask) {
        const ctx = mask.getContext('2d', { willReadFrequently: true });
        if(!ctx) return;

        // Verifica se há pixels desenhados na máscara
        const pixelBuffer = new Uint32Array(
          ctx.getImageData(0, 0, mask.width, mask.height).data.buffer
        );
        const hasDrawing = pixelBuffer.some(color => color !== 0);

        if (hasDrawing) {
          setEditModalPosition({ x: event.clientX, y: event.clientY });
          setIsEditModalOpen(true);
        }
      }
    }
  }, [activeTool]);

  /**
   * Aplica edição do modal e chama geração da IA
   * Fecha modal e executa função de geração com prompt customizado
   * Usado quando usuário confirma edição no EditPromptModal
   */
  const handleApplyEdit = useCallback(async (
    modalPrompt: string,
    modalObjectImages: ReferenceImage[],
    generateFunction: (prompt: string, objects: ReferenceImage[]) => Promise<void>
  ) => {
    setIsEditModalOpen(false);
    await generateFunction(modalPrompt, modalObjectImages);
  }, []);

  /**
   * Cancela edição e limpa máscara desenhada
   * Fecha modal sem aplicar mudanças e remove seleção do canvas
   * Usado quando usuário cancela no EditPromptModal ou clica fora
   */
  const handleCancelEdit = useCallback((
    canvasComponentRef: React.RefObject<{ clearMask: () => void }>
  ) => {
    setIsEditModalOpen(false);
    canvasComponentRef.current?.clearMask();
  }, []);

  // ========== HANDLERS DAS SIDEBARS ==========

  /**
   * Alterna visibilidade da sidebar esquerda
   * Contém controles de projeto, upload, prompt e referências
   */
  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarVisible(prev => !prev);
  }, []);

  /**
   * Alterna visibilidade da sidebar direita
   * Contém histórico de versões do projeto
   */
  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarVisible(prev => !prev);
  }, []);

  return {
    // ========== ESTADOS EXPORTADOS ==========

    // Estados das ferramentas
    brushSize,              // Tamanho atual do pincel
    setBrushSize,           // Atualiza tamanho do pincel
    brushMode,              // Modo atual (desenho/apagador)
    setBrushMode,           // Atualiza modo do pincel
    activeTool,             // Ferramenta ativa atual

    // Estados dos modais
    isEditModalOpen,        // Modal de edição aberto?
    editModalPosition,      // Posição X/Y do modal

    // Estados das sidebars
    isLeftSidebarVisible,   // Sidebar esquerda visível?
    isRightSidebarVisible,  // Sidebar direita visível?

    // Estado do projeto
    projectName,            // Nome atual do projeto
    setProjectName,         // Atualiza nome do projeto

    // ========== HANDLERS EXPORTADOS ==========

    // Handlers das ferramentas
    handleToolSelect,       // Seleciona/deseleciona ferramenta
    toggleBrushMode,        // Alterna desenho/apagador

    // Handlers dos modais
    handleDrawingStop,      // Detecta fim de desenho (abre modal)
    handleApplyEdit,        // Confirma edição no modal
    handleCancelEdit,       // Cancela edição no modal

    // Handlers das sidebars
    toggleLeftSidebar,      // Mostra/oculta sidebar esquerda
    toggleRightSidebar,     // Mostra/oculta sidebar direita

    // ========== VALORES COMPUTADOS ==========
    isAnyToolActive: activeTool !== null,           // Alguma ferramenta ativa?
    isDrawToolActive: activeTool === 'draw',        // Ferramenta de desenho ativa?
    isSelectToolActive: activeTool === 'select',    // Ferramenta de seleção ativa?
    isEraseMode: brushMode === BrushMode.Erase      // Modo apagador ativo?
  };
};