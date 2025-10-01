export const initialFolders = [
  { id: 'recents', name: 'Projeto Recentes' }
  // Favorites and archived are now handled as special filters
]

export const initialProjects = [
  {
    id: 'proj-1',
    name: 'Sala de Estar Clássica',
    baseImage: 'https://picsum.photos/seed/proj1/800/600',
    history: ['https://picsum.photos/seed/proj1/800/600', 'https://picsum.photos/seed/proj1-edit1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-2',
    name: 'Cozinha Moderna',
    baseImage: 'https://picsum.photos/seed/proj2/800/600',
    history: ['https://picsum.photos/seed/proj2/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-3',
    name: 'Quarto Aconchegante',
    baseImage: null,
    history: [],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-4',
    name: 'Banheiro Minimalista',
    baseImage: 'https://picsum.photos/seed/proj4/800/600',
    history: ['https://picsum.photos/seed/proj4/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: true
  },
  // Projetos adicionais para teste
  {
    id: 'proj-5',
    name: 'Escritório Corporativo',
    baseImage: 'https://picsum.photos/seed/office1/800/600',
    history: ['https://picsum.photos/seed/office1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-6',
    name: 'Varanda Gourmet',
    baseImage: 'https://picsum.photos/seed/balcony1/800/600',
    history: ['https://picsum.photos/seed/balcony1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-7',
    name: 'Quarto Infantil',
    baseImage: 'https://picsum.photos/seed/kids1/800/600',
    history: ['https://picsum.photos/seed/kids1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-8',
    name: 'Sala de Jantar Elegante',
    baseImage: 'https://picsum.photos/seed/dining1/800/600',
    history: ['https://picsum.photos/seed/dining1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-9',
    name: 'Home Office Moderno',
    baseImage: 'https://picsum.photos/seed/homeoffice1/800/600',
    history: ['https://picsum.photos/seed/homeoffice1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-10',
    name: 'Cozinha Americana',
    baseImage: 'https://picsum.photos/seed/kitchen2/800/600',
    history: ['https://picsum.photos/seed/kitchen2/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-11',
    name: 'Suite Master',
    baseImage: 'https://picsum.photos/seed/master1/800/600',
    history: ['https://picsum.photos/seed/master1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-12',
    name: 'Área de Lazer',
    baseImage: 'https://picsum.photos/seed/leisure1/800/600',
    history: ['https://picsum.photos/seed/leisure1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-13',
    name: 'Closet Planejado',
    baseImage: 'https://picsum.photos/seed/closet1/800/600',
    history: ['https://picsum.photos/seed/closet1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-14',
    name: 'Banheiro Luxuoso',
    baseImage: 'https://picsum.photos/seed/bathroom2/800/600',
    history: ['https://picsum.photos/seed/bathroom2/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-15',
    name: 'Lavanderia Funcional',
    baseImage: 'https://picsum.photos/seed/laundry1/800/600',
    history: ['https://picsum.photos/seed/laundry1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-16',
    name: 'Sala de TV Aconchegante',
    baseImage: 'https://picsum.photos/seed/tv1/800/600',
    history: ['https://picsum.photos/seed/tv1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-17',
    name: 'Quarto de Hóspedes',
    baseImage: 'https://picsum.photos/seed/guest1/800/600',
    history: ['https://picsum.photos/seed/guest1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-18',
    name: 'Hall de Entrada',
    baseImage: 'https://picsum.photos/seed/hall1/800/600',
    history: ['https://picsum.photos/seed/hall1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: true
  },
  {
    id: 'proj-19',
    name: 'Biblioteca Clássica',
    baseImage: 'https://picsum.photos/seed/library1/800/600',
    history: ['https://picsum.photos/seed/library1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-20',
    name: 'Academia Residencial',
    baseImage: 'https://picsum.photos/seed/gym1/800/600',
    history: ['https://picsum.photos/seed/gym1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-21',
    name: 'Sótão Convertido',
    baseImage: 'https://picsum.photos/seed/attic1/800/600',
    history: ['https://picsum.photos/seed/attic1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-22',
    name: 'Terraço Urbano',
    baseImage: 'https://picsum.photos/seed/terrace1/800/600',
    history: ['https://picsum.photos/seed/terrace1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-23',
    name: 'Cozinha Gourmet',
    baseImage: 'https://picsum.photos/seed/gourmet1/800/600',
    history: ['https://picsum.photos/seed/gourmet1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-24',
    name: 'Despensa Organizada',
    baseImage: 'https://picsum.photos/seed/pantry1/800/600',
    history: ['https://picsum.photos/seed/pantry1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-25',
    name: 'Sala de Jogos',
    baseImage: 'https://picsum.photos/seed/games1/800/600',
    history: ['https://picsum.photos/seed/games1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-26',
    name: 'Estúdio de Arte',
    baseImage: 'https://picsum.photos/seed/studio1/800/600',
    history: ['https://picsum.photos/seed/studio1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-27',
    name: 'Sala de Música',
    baseImage: 'https://picsum.photos/seed/music1/800/600',
    history: ['https://picsum.photos/seed/music1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: true
  },
  {
    id: 'proj-28',
    name: 'Loft Industrial',
    baseImage: 'https://picsum.photos/seed/loft1/800/600',
    history: ['https://picsum.photos/seed/loft1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-29',
    name: 'Jardim de Inverno',
    baseImage: 'https://picsum.photos/seed/garden1/800/600',
    history: ['https://picsum.photos/seed/garden1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-30',
    name: 'Spa Residencial',
    baseImage: 'https://picsum.photos/seed/spa1/800/600',
    history: ['https://picsum.photos/seed/spa1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-31',
    name: 'Cozinha Retrô',
    baseImage: 'https://picsum.photos/seed/retro1/800/600',
    history: ['https://picsum.photos/seed/retro1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-32',
    name: 'Sala Minimalista',
    baseImage: 'https://picsum.photos/seed/minimal1/800/600',
    history: ['https://picsum.photos/seed/minimal1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-33',
    name: 'Quarto Boho',
    baseImage: 'https://picsum.photos/seed/boho1/800/600',
    history: ['https://picsum.photos/seed/boho1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-34',
    name: 'Banheiro Rústico',
    baseImage: 'https://picsum.photos/seed/rustic1/800/600',
    history: ['https://picsum.photos/seed/rustic1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-35',
    name: 'Coworking Criativo',
    baseImage: 'https://picsum.photos/seed/cowork1/800/600',
    history: ['https://picsum.photos/seed/cowork1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-36',
    name: 'Sala de Cinema',
    baseImage: 'https://picsum.photos/seed/cinema1/800/600',
    history: ['https://picsum.photos/seed/cinema1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    isArchived: false
  },
  {
    id: 'proj-37',
    name: 'Adega Sofisticada',
    baseImage: 'https://picsum.photos/seed/wine1/800/600',
    history: ['https://picsum.photos/seed/wine1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-38',
    name: 'Quarto Nórdico',
    baseImage: 'https://picsum.photos/seed/nordic1/800/600',
    history: ['https://picsum.photos/seed/nordic1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  },
  {
    id: 'proj-39',
    name: 'Cozinha Industrial',
    baseImage: 'https://picsum.photos/seed/industrial1/800/600',
    history: ['https://picsum.photos/seed/industrial1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: true
  },
  {
    id: 'proj-40',
    name: 'Sala de Reuniões',
    baseImage: 'https://picsum.photos/seed/meeting1/800/600',
    history: ['https://picsum.photos/seed/meeting1/800/600'],
    folderId: 'recents',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    isArchived: false
  }
]