import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import ProjectGallery from '../components/ProjectGallery';
import Editor from '../components/Editor';
import SignInPage from '../components/SignInPage';
import SignUpPage from '../components/SignUpPage';
import SuccessPage from '../components/SuccessPage';
import CancelPage from '../components/CancelPage';
import ProfilePage from '../components/ProfilePage';
import PricingPage from '../components/PricingPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Route constants and helpers
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  WELCOME: '/welcome',
  GALLERY: '/gallery',
  EDITOR: '/editor',
  EDITOR_WITH_PROJECT: '/editor/:projectId',
  PRICING: '/pricing',
  SUCCESS: '/success',
  CANCEL: '/cancel',
  PROFILE: '/profile',
  NOT_FOUND: '*'
} as const;

export const createEditorRoute = (projectId: string) => `/editor/${projectId}`;

export type RouteParams = {
  projectId?: string;
};

export interface RouteMeta {
  title?: string;
  description?: string;
  requiresProject?: boolean;
  isProtected?: boolean;
}

export interface AppRoute {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  redirect?: string;
  meta?: RouteMeta;
  wrapper?: React.ComponentType<{ children: React.ReactNode; requireProject?: boolean }>;
}

export const routes: AppRoute[] = [
  {
    path: ROUTES.HOME,
    name: 'Home',
    component: () => <Navigate to={ROUTES.WELCOME} replace />,
    redirect: ROUTES.WELCOME
  },
  {
    path: ROUTES.SIGN_IN,
    name: 'SignIn',
    component: SignInPage,
    meta: {
      title: 'Login - Ktírio',
      description: 'Faça login para continuar'
    }
  },
  {
    path: ROUTES.SIGN_UP,
    name: 'SignUp',
    component: SignUpPage,
    meta: {
      title: 'Cadastro - Ktírio',
      description: 'Crie sua conta gratuita'
    }
  },
  {
    path: ROUTES.WELCOME,
    name: 'Welcome',
    component: LandingPage,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Bem-vindo - Ktírio Virtual Home Staging AI',
      description: 'Transforme ambientes com inteligência artificial',
      isProtected: true
    }
  },
  {
    path: ROUTES.GALLERY,
    name: 'Gallery',
    component: ProjectGallery,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Galeria de Projetos - Ktírio',
      description: 'Gerencie seus projetos de decoração com IA',
      isProtected: true
    }
  },
  {
    path: ROUTES.EDITOR,
    name: 'EditorRedirect',
    component: () => <Navigate to={ROUTES.GALLERY} replace />
  },
  {
    path: ROUTES.EDITOR_WITH_PROJECT,
    name: 'Editor',
    component: Editor,
    meta: {
      title: 'Editor - Ktírio',
      description: 'Editor de decoração com inteligência artificial',
      requiresProject: true,
      isProtected: true
    },
    wrapper: ProtectedRoute
  },
  {
    path: ROUTES.PRICING,
    name: 'Pricing',
    component: PricingPage,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Planos e Preços - Ktírio',
      description: 'Escolha o plano ideal para você',
      isProtected: true
    }
  },
  {
    path: ROUTES.SUCCESS,
    name: 'Success',
    component: SuccessPage,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Pagamento Confirmado - Ktírio',
      description: 'Sua assinatura foi ativada com sucesso',
      isProtected: true
    }
  },
  {
    path: ROUTES.CANCEL,
    name: 'Cancel',
    component: CancelPage,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Pagamento Cancelado - Ktírio',
      description: 'Você cancelou o processo de pagamento',
      isProtected: true
    }
  },
  {
    path: ROUTES.PROFILE,
    name: 'Profile',
    component: ProfilePage,
    wrapper: ProtectedRoute,
    meta: {
      title: 'Perfil - Ktírio',
      description: 'Gerencie sua conta e assinatura',
      isProtected: true
    }
  },
  {
    path: ROUTES.NOT_FOUND,
    name: 'NotFound',
    component: () => <Navigate to={ROUTES.WELCOME} replace />
  }
];