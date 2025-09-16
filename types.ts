
export enum BrushMode {
  Draw = 'draw',
  Erase = 'erase',
}

export enum ReferenceType {
  Style = 'Estilo',
  Object = 'Objeto/Produto',
  Lighting = 'Iluminação',
  Background = 'Ambiente/Segundo Plano',
}

export interface ReferenceImage {
  id: string;
  url: string;
  name: string;
  types: ReferenceType[];
}


export interface Project {
  id: string;
  name: string;
  baseImage: string | null;
  history: string[];
  folderId: string | null;
  createdAt: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface Folder {
  id: string;
  name: string;
}