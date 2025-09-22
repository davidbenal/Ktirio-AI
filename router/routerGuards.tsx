import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from './routerConfig';
import { useProjects } from '../contexts/ProjectsContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface RouterGuard {
  to: {
    path: string;
    name?: string;
    params?: Record<string, string>;
    meta?: any;
  };
  from: {
    path: string;
  };
  next: () => void;
}

type BeforeEachGuard = (guard: RouterGuard) => void;

interface RouterGuardsProps {
  children: React.ReactNode;
  beforeEach?: BeforeEachGuard;
}

export const RouterGuards: React.FC<RouterGuardsProps> = ({
  children,
  beforeEach
}) => {
  const location = useLocation();
  const { projects } = useProjects();

  // Apply document title based on current route
  useDocumentTitle();

  useEffect(() => {
    const currentRoute = routes.find(route => {
      if (route.path === '*') return false;
      if (route.path.includes(':')) {
        const pathPattern = route.path.replace(/:([^/]+)/g, '([^/]+)');
        const regex = new RegExp(`^${pathPattern}$`);
        return regex.test(location.pathname);
      }
      return route.path === location.pathname;
    });

    if (currentRoute && beforeEach) {
      const params: Record<string, string> = {};

      if (currentRoute.path.includes(':')) {
        const pathPattern = currentRoute.path.replace(/:([^/]+)/g, '([^/]+)');
        const regex = new RegExp(`^${pathPattern}$`);
        const match = location.pathname.match(regex);

        if (match) {
          const paramNames = currentRoute.path.match(/:([^/]+)/g)?.map(p => p.slice(1)) || [];
          paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
          });
        }
      }

      const guard: RouterGuard = {
        to: {
          path: location.pathname,
          name: currentRoute.name,
          params,
          meta: currentRoute.meta
        },
        from: {
          path: '/' // This would need to be tracked for full implementation
        },
        next: () => {}
      };

      beforeEach(guard);
    }

    // Built-in guards for project validation
    if (currentRoute?.meta?.requiresProject) {
      const projectIdMatch = location.pathname.match(/\/editor\/(.+)$/);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        const project = projects.find(p => p.id === projectId);

        if (!project) {
          console.warn(`Project ${projectId} not found, should redirect to gallery`);
          // Navigation would be handled by ProtectedRoute component
        }
      }
    }
  }, [location.pathname, beforeEach, projects]);

  return <>{children}</>;
};

// Default beforeEach implementation similar to Vue Router
export const defaultBeforeEach: BeforeEachGuard = ({ to, from, next }) => {
  // Example guard logic
  console.log(`Navigating from ${from.path} to ${to.path}`);

  // Set document title if specified in meta
  if (to.meta?.title) {
    document.title = to.meta.title;
  }

  // Call next to continue navigation
  next();
};