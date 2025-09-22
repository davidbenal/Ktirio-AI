import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useProjects } from '../contexts/ProjectsContext';
import { ROUTES } from '../router/routerConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProject?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProject = false
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, setCurrentProjectId } = useProjects();

  // Aguarda o Clerk carregar
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login local
  if (!isSignedIn) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // Validação de projeto (se necessário)
  if (requireProject && projectId) {
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return <Navigate to={ROUTES.GALLERY} replace />;
    }

    setCurrentProjectId(projectId);
  }

  if (requireProject && !projectId) {
    return <Navigate to={ROUTES.GALLERY} replace />;
  }

  return <>{children}</>;
};