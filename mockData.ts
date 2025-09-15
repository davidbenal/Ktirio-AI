
import { Project, Folder } from './types';

export const initialFolders: Folder[] = [
    { id: 'recents', name: 'Projeto Recentes' },
    // These are now handled as special filters, but can be kept for UI consistency
    // { id: 'favorites', name: 'Favoritos' },
    // { id: 'archive', name: 'Arquivados' },
];

export const initialProjects: Project[] = [
    {
        id: 'proj-1',
        name: 'Sala de Estar Clássica',
        baseImage: 'https://picsum.photos/seed/proj1/800/600',
        history: ['https://picsum.photos/seed/proj1/800/600', 'https://picsum.photos/seed/proj1-edit1/800/600'],
        folderId: 'recents',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isFavorite: true,
        isArchived: false,
    },
    {
        id: 'proj-2',
        name: 'Cozinha Moderna',
        baseImage: 'https://picsum.photos/seed/proj2/800/600',
        history: ['https://picsum.photos/seed/proj2/800/600'],
        folderId: 'recents',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isFavorite: false,
        isArchived: false,
    },
    {
        id: 'proj-3',
        name: 'Quarto Aconchegante',
        baseImage: null,
        history: [],
        folderId: 'recents',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isFavorite: false,
        isArchived: false,
    },
     {
        id: 'proj-4',
        name: 'Banheiro Minimalista',
        baseImage: 'https://picsum.photos/seed/proj4/800/600',
        history: ['https://picsum.photos/seed/proj4/800/600'],
        folderId: 'recents',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isFavorite: false,
        isArchived: true,
    },
];
