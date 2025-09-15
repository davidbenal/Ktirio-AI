
export enum BrushMode {
  Draw = 'draw',
  Erase = 'erase',
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
