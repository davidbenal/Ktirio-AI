import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from '../router/routerConfig';
import { RouterGuards, defaultBeforeEach } from '../router/routerGuards';
import { useProjects } from '../contexts/ProjectsContext';
import { useFolders } from '../contexts/FoldersContext';
import { useRouter } from '../hooks/useRouter';
import { useConfirmModal } from '../hooks/useConfirmModal';

const AppRouter: React.FC = () => {
  const {
    currentProject,
    updateProject,
    deleteProject,
    renameProject,
    duplicateProject,
    toggleFavorite,
    toggleArchive,
    moveProject,
    projects,
    createNewProject,
    createNewProjectFromVersion,
    setCurrentProjectId
  } = useProjects();

  const { addFolder, folders } = useFolders();
  const router = useRouter();
  const { prompt } = useConfirmModal();

  const handleStartProject = () => {
    router.pushByName('Gallery');
  };

  const handleNewProject = async () => {
    const projectName = await prompt({
      title: 'Novo Projeto',
      message: 'Qual será o nome do seu novo projeto?',
      placeholder: 'Nome do projeto',
      initialValue: 'Novo Projeto',
      confirmText: 'Criar Projeto',
      cancelText: 'Cancelar',
      validation: (value) => {
        if (!value.trim()) {
          return 'O nome do projeto não pode estar vazio';
        }
        if (value.trim().length > 100) {
          return 'O nome do projeto não pode ter mais de 100 caracteres';
        }
        return null;
      },
    });

    if (projectName) {
      const newProject = createNewProject(projectName.trim());
      router.pushByName('Editor', { projectId: newProject.id });
    }
  };

  const handleSelectProject = (projectId: string) => {
    router.pushByName('Editor', { projectId });
  };

  const handleBackToGallery = () => {
    setCurrentProjectId(null);
    router.pushByName('Gallery');
  };

  const handleNewProjectFromVersion = (image?: string) => {
    if (currentProject) {
      const newProject = createNewProjectFromVersion(currentProject, image);
      router.pushByName('Editor', { projectId: newProject.id });
    }
  };

  const createRouteProps = (routeName: string) => {
    switch (routeName) {
      case 'Welcome':
        return { onStartProject: handleStartProject };

      case 'Gallery':
        return {
          projects,
          folders,
          onNewProject: handleNewProject,
          onSelectProject: handleSelectProject,
          onDeleteProject: deleteProject,
          onRenameProject: renameProject,
          onDuplicateProject: duplicateProject,
          onNewFolder: addFolder,
          onToggleFavorite: toggleFavorite,
          onToggleArchive: toggleArchive,
          onMoveProject: moveProject,
        };

      case 'Editor':
        return currentProject ? {
          key: currentProject.id,
          project: currentProject,
          onUpdateProject: updateProject,
          onBackToGallery: handleBackToGallery,
          onDuplicateProject: () => duplicateProject(currentProject.id),
          onNewProjectFromVersion: handleNewProjectFromVersion,
          onToggleFavorite: () => toggleFavorite(currentProject.id),
          onToggleArchive: () => toggleArchive(currentProject.id),
          onMoveProject: (folderId: string) => moveProject(currentProject.id, folderId),
          folders,
        } : {};

      default:
        return {};
    }
  };

  return (
    <RouterGuards beforeEach={defaultBeforeEach}>
      <Routes>
        {routes.map((route) => {
          const Component = route.component;
          const Wrapper = route.wrapper;
          const props = createRouteProps(route.name);

          const element = Wrapper ? (
            <Wrapper requireProject={route.meta?.requiresProject}>
              <Component {...props} />
            </Wrapper>
          ) : (
            <Component {...props} />
          );

          return (
            <Route
              key={route.name}
              path={route.path}
              element={element}
            />
          );
        })}
      </Routes>
    </RouterGuards>
  );
};

export default AppRouter;