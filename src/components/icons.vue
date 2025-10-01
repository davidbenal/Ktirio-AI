<template>
  <span>
    <!-- Este arquivo contém os componentes de ícones usados no projeto -->
  </span>
</template>

<script>
// Ícone de Pincel
export const PaintBrushIcon = {
  name: 'PaintBrushIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.414 3.414L8.414 8.414L7 7L12 2ZM8.414 9.828L9.828 11.242L3.828 17.242C3.437 17.633 2.804 17.633 2.414 17.242C2.023 16.851 2.023 16.218 2.414 15.828L8.414 9.828Z" :fill="color"/>
    </svg>
  `
}

// Ícone de Borracha
export const EraserIcon = {
  name: 'EraserIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.24 3.56L21.19 8.51C21.97 9.29 21.97 10.55 21.19 11.33L12.8 19.72C12.02 20.5 10.76 20.5 9.98 19.72L5.03 14.77C4.25 13.99 4.25 12.73 5.03 11.95L13.42 3.56C14.2 2.78 15.46 2.78 16.24 3.56Z" :fill="color"/>
    </svg>
  `
}

// Ícone de Download
export const DownloadIcon = {
  name: 'DownloadIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16L7 11L8.4 9.6L11 12.2V4H13V12.2L15.6 9.6L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.588 19.413C4.196 19.021 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.413 19.413C19.021 19.804 18.55 20 18 20H6Z" :fill="color"/>
    </svg>
  `
}

// Ícone de Histórico
export const HistoryIcon = {
  name: 'HistoryIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" :fill="color"/>
    </svg>
  `
}

// Ícone de Ferramenta de Seleção
export const SelectToolIcon = {
  name: 'SelectToolIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H5V5H3V3ZM7 3H9V5H7V3ZM11 3H13V5H11V3ZM15 3H17V5H15V3ZM19 3H21V5H19V3ZM3 7H5V9H3V7ZM19 7H21V9H19V7ZM3 11H5V13H3V11ZM19 11H21V13H19V11ZM3 15H5V17H3V15ZM19 15H21V17H19V15ZM3 19H5V21H3V19ZM7 19H9V21H7V19ZM11 19H13V21H11V19ZM15 19H17V21H15V19ZM19 19H21V21H19V19Z" :fill="color"/>
    </svg>
  `
}


// Ícone de Ferramenta de Remoção
export const RemoveIcon = {
  name: 'RemoveIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  `
}


// Ícone de Régua
export const RulerIcon = {
  name: 'RulerIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H21V6H3V3Z" fill="currentColor"/>
      <path d="M3 6H5V9H3V6Z" fill="currentColor"/>
      <path d="M7 6H9V8H7V6Z" fill="currentColor"/>
      <path d="M11 6H13V9H11V6Z" fill="currentColor"/>
      <path d="M15 6H17V8H15V6Z" fill="currentColor"/>
      <path d="M19 6H21V9H19V6Z" fill="currentColor"/>
    </svg>
  `
}

// Ícone de Grade
export const GridIcon = {
  name: 'GridIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21V3H3ZM19 19H13V13H19V19ZM19 11H13V5H19V11ZM11 19H5V13H11V19ZM11 11H5V5H11V11Z" fill="currentColor"/>
    </svg>
  `
}


// Ícone de Ferramentas
export const ToolsIcon = {
  name: 'ToolsIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.7 19L13.6 9.9C14.5 7.6 14 4.9 12.1 3C10.1 1 7.1 0.6 4.7 1.7L9 6L6 9L1.6 4.7C0.4 7.1 0.9 10.1 2.9 12.1C4.8 14 7.5 14.5 9.8 13.6L18.9 22.7C19.3 23.1 19.9 23.1 20.3 22.7L22.6 20.4C23.1 20 23.1 19.3 22.7 19Z" :fill="color"/>
    </svg>
  `
}

// Ícone de Estrela (Favorito)
export const StarIcon = {
  name: 'StarIcon',
  props: {
    size: { type: String, default: '20' },
    color: { type: String, default: 'currentColor' },
    filled: { type: Boolean, default: false }
  },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" :fill="filled ? color : 'none'" :stroke="color" stroke-width="2"/>
    </svg>
  `
}

export default {
  name: 'Icons'
}
</script>