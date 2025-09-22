import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Project } from '../types';
import { initialProjects } from '../mockData';
import { useConfirmModal } from '../hooks/useConfirmModal';

interface ProjectsContextType {
  projects: Project[];
  currentProjectId: string | null;
  currentProject: Project | undefined;
  setCurrentProjectId: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  renameProject: (projectId: string, newName: string) => void;
  duplicateProject: (projectId: string) => void;
  toggleFavorite: (projectId: string) => void;
  toggleArchive: (projectId: string) => void;
  moveProject: (projectId: string, folderId: string) => void;
  createNewProject: (projectName?: string) => Project;
  createNewProjectFromVersion: (sourceProject: Project, image?: string) => Project;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects deve ser usado dentro de ProjectsProvider');
  }
  return context;
};

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const { confirmDelete } = useConfirmModal();

  const currentProject = projects.find(p => p.id === currentProjectId);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prevProjects =>
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const deleteProject = useCallback(async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    const confirmed = await confirmDelete(project?.name || 'este projeto');

    if (confirmed) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProjectId === projectId) {
        setCurrentProjectId(null);
      }
    }
  }, [confirmDelete, projects, currentProjectId]);

  const renameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, name: newName } : p
    ));
  };

  const duplicateProject = (projectId: string) => {
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (projectToDuplicate) {
      const newProject: Project = {
        ...projectToDuplicate,
        id: `proj-${Date.now()}`,
        name: `${projectToDuplicate.name} (Cópia)`,
        createdAt: new Date().toISOString(),
      };
      addProject(newProject);
    }
  };

  const toggleFavorite = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const toggleArchive = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, isArchived: !p.isArchived } : p
    ));
  };

  const moveProject = (projectId: string, folderId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, folderId: folderId } : p
    ));
  };

  const createNewProject = (projectName?: string): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectName || 'Novo Projeto Sem Título',
      baseImage: null,
      history: [],
      folderId: 'recents',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
    };
    addProject(newProject);
    return newProject;
  };

  const createNewProjectFromVersion = (sourceProject: Project, image?: string): Project => {
    const sourceImage = image || sourceProject.history[sourceProject.history.length - 1] || sourceProject.baseImage;
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `${sourceProject.name} (Versão)`,
      baseImage: sourceImage,
      history: sourceImage ? [sourceImage] : [],
      folderId: sourceProject.folderId,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
    };
    addProject(newProject);
    return newProject;
  };

  const value: ProjectsContextType = {
    projects,
    currentProjectId,
    currentProject,
    setCurrentProjectId,
    addProject,
    updateProject,
    deleteProject,
    renameProject,
    duplicateProject,
    toggleFavorite,
    toggleArchive,
    moveProject,
    createNewProject,
    createNewProjectFromVersion,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};