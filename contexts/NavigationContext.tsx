import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, createEditorRoute } from '../router/routerConfig';

export type AppScreen = 'landing' | 'gallery' | 'editor';

interface NavigationContextType {
  currentScreen: AppScreen;
  goToLanding: () => void;
  goToGallery: () => void;
  goToEditor: (projectId?: string) => void;
  navigateToProject: (projectId: string) => void;
  getCurrentProjectId: () => string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');

  useEffect(() => {
    const path = location.pathname;

    if (path === ROUTES.HOME) {
      setCurrentScreen('landing');
    } else if (path === ROUTES.GALLERY) {
      setCurrentScreen('gallery');
    } else if (path.startsWith('/editor')) {
      setCurrentScreen('editor');
    }
  }, [location.pathname]);

  const goToLanding = () => {
    navigate(ROUTES.HOME);
  };

  const goToGallery = () => {
    navigate(ROUTES.GALLERY);
  };

  const goToEditor = (projectId?: string) => {
    if (projectId) {
      navigate(createEditorRoute(projectId));
    } else {
      navigate(ROUTES.EDITOR);
    }
  };

  const navigateToProject = (projectId: string) => {
    navigate(createEditorRoute(projectId));
  };

  const getCurrentProjectId = (): string | null => {
    const path = location.pathname;
    const match = path.match(/^\/editor\/(.+)$/);
    return match ? match[1] : null;
  };

  const value: NavigationContextType = {
    currentScreen,
    goToLanding,
    goToGallery,
    goToEditor,
    navigateToProject,
    getCurrentProjectId,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};