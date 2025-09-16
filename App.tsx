
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Editor from './components/Editor';
import ProjectGallery from './components/ProjectGallery';
import { Project, Folder } from './types';
import { initialFolders, initialProjects } from './mockData';

type AppScreen = 'landing' | 'gallery' | 'editor';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const goToGallery = () => setScreen('gallery');
  
  const handleStartProject = () => {
    // From landing page, go to gallery first
    setScreen('gallery');
  };

  const handleNewProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'Novo Projeto Sem Título',
      baseImage: null,
      history: [],
      folderId: 'recents',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setScreen('editor');
  };

  const handleNewProjectFromVersion = (project: Project, image?: string) => {
    const sourceImage = image || project.history[project.history.length - 1] || project.baseImage;
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `${project.name} (Versão)`,
      baseImage: sourceImage,
      history: sourceImage ? [sourceImage] : [],
      folderId: project.folderId,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setScreen('editor'); // Go directly to the new project editor
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    setScreen('editor');
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
  };

  const handleDuplicateProject = (projectId: string) => {
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (projectToDuplicate) {
        const newProject: Project = {
            ...projectToDuplicate,
            id: `proj-${Date.now()}`,
            name: `${projectToDuplicate.name} (Cópia)`,
            createdAt: new Date().toISOString(),
        };
        setProjects(prev => [newProject, ...prev]);
    }
  };

  const handleBackToGallery = () => {
    setCurrentProjectId(null);
    setScreen('gallery');
  }

  const handleNewFolder = (folderName: string) => {
      const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name: folderName,
      };
      setFolders(prev => [...prev, newFolder]);
  };

  const handleToggleFavorite = (projectId: string) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleToggleArchive = (projectId: string) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isArchived: !p.isArchived } : p));
  };

  const handleMoveProject = (projectId: string, folderId: string) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, folderId: folderId } : p));
  };

  const currentProject = projects.find(p => p.id === currentProjectId);

  const renderScreen = () => {
    switch(screen) {
      case 'landing':
        return <LandingPage onStartProject={handleStartProject} />;
      case 'gallery':
        return <ProjectGallery 
                  projects={projects} 
                  folders={folders} 
                  onNewProject={handleNewProject}
                  onSelectProject={handleSelectProject}
                  onDeleteProject={handleDeleteProject}
                  onRenameProject={handleRenameProject}
                  onDuplicateProject={handleDuplicateProject}
                  onNewFolder={handleNewFolder}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleArchive={handleToggleArchive}
                  onMoveProject={handleMoveProject}
                />;
      case 'editor':
        if (currentProject) {
            return <Editor 
                key={currentProject.id}
                project={currentProject} 
                onUpdateProject={handleUpdateProject}
                onBackToGallery={handleBackToGallery}
                onDuplicateProject={() => handleDuplicateProject(currentProject.id)}
                onNewProjectFromVersion={(image?: string) => handleNewProjectFromVersion(currentProject, image)}
                onToggleFavorite={() => handleToggleFavorite(currentProject.id)}
                onToggleArchive={() => handleToggleArchive(currentProject.id)}
                onMoveProject={(folderId: string) => handleMoveProject(currentProject.id, folderId)}
                folders={folders}
            />;
        }
        // Fallback to gallery if no project is selected
        goToGallery();
        return null;
      default:
        return <LandingPage onStartProject={handleStartProject} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans text-gray-800">
      {renderScreen()}
    </div>
  );
};

export default App;
