import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../router/routerConfig';

export const useDocumentTitle = () => {
  const location = useLocation();

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

    if (currentRoute?.meta?.title) {
      document.title = currentRoute.meta.title;
    } else {
      document.title = 'Ktírio - Virtual Home Staging AI';
    }

    if (currentRoute?.meta?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', currentRoute.meta.description);
    }
  }, [location.pathname]);
};