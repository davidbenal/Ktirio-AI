import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Folder } from '../types';
import { initialFolders } from '../mockData';
import { useConfirmModal } from '../hooks/useConfirmModal';

interface FoldersContextType {
  folders: Folder[];
  addFolder: (folderName: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export const useFolders = () => {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders deve ser usado dentro de FoldersProvider');
  }
  return context;
};

interface FoldersProviderProps {
  children: ReactNode;
}

export const FoldersProvider: React.FC<FoldersProviderProps> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const { confirmDelete } = useConfirmModal();

  const addFolder = (folderName: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: folderName,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = useCallback(async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    const confirmed = await confirmDelete(folder?.name || 'esta pasta');

    if (confirmed) {
      setFolders(prev => prev.filter(f => f.id !== folderId));
    }
  }, [confirmDelete, folders]);

  const renameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    ));
  };

  const value: FoldersContextType = {
    folders,
    addFolder,
    deleteFolder,
    renameFolder,
  };

  return (
    <FoldersContext.Provider value={value}>
      {children}
    </FoldersContext.Provider>
  );
};