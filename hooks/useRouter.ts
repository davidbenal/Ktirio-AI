import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { routes } from '../router/routerConfig';

export interface RouterPushOptions {
  replace?: boolean;
}

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const push = (path: string, options?: RouterPushOptions) => {
    navigate(path, { replace: options?.replace || false });
  };

  const replace = (path: string) => {
    navigate(path, { replace: true });
  };

  const go = (delta: number) => {
    navigate(delta);
  };

  const back = () => {
    navigate(-1);
  };

  const forward = () => {
    navigate(1);
  };

  const getCurrentRoute = () => {
    return routes.find(route => {
      if (route.path === '*') return false;
      if (route.path.includes(':')) {
        const pathPattern = route.path.replace(/:([^/]+)/g, '([^/]+)');
        const regex = new RegExp(`^${pathPattern}$`);
        return regex.test(location.pathname);
      }
      return route.path === location.pathname;
    });
  };

  const getRouteByName = (name: string) => {
    return routes.find(route => route.name === name);
  };

  const pushByName = (name: string, params?: Record<string, string>, options?: RouterPushOptions) => {
    const route = getRouteByName(name);
    if (!route) {
      console.warn(`Route with name "${name}" not found`);
      return;
    }

    let path = route.path;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value);
      });
    }

    push(path, options);
  };

  return {
    push,
    replace,
    go,
    back,
    forward,
    currentRoute: getCurrentRoute(),
    params,
    query: new URLSearchParams(location.search),
    path: location.pathname,
    fullPath: location.pathname + location.search,
    getRouteByName,
    pushByName,
    beforeEach: (guard: (to: any, from: any, next: () => void) => void) => {
      // This would need to be implemented at the router level
      console.warn('beforeEach guards should be implemented at the router level');
    }
  };
};