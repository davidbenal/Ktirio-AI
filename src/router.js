import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@clerk/vue'
import { useProjectsStore } from './stores/projects.js'

// Importações das páginas/views
const Home = () => import('./views/Home.vue')
const SignIn = () => import('./views/SignIn.vue')
const SignUp = () => import('./views/SignUp.vue')
const Gallery = () => import('./views/Gallery.vue')
const Editor = () => import('./views/Editor.vue')
const ClerkTest = () => import('./views/ClerkTest.vue')

// Definição das rotas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Ktírio - Virtual Home Staging AI'
    }
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: {
      title: 'Login - Ktírio',
      requiresAuth: false
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: {
      title: 'Cadastro - Ktírio',
      requiresAuth: false
    }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    meta: {
      title: 'Galeria de Projetos - Ktírio'
      // requiresAuth: true // Removido temporariamente - proteção no componente
    }
  },
  {
    path: '/clerk-test',
    name: 'ClerkTest',
    component: ClerkTest,
    meta: {
      title: 'Teste Clerk - Ktírio',
      requiresAuth: false
    }
  },
  {
    path: '/editor/:projectId',
    name: 'Editor',
    component: Editor,
    meta: {
      title: 'Editor - Ktírio',
      requiresAuth: true,
      requiresProject: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/gallery'
  }
]

// Cria o router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards de navegação
router.beforeEach((to, from, next) => {
  // Definir título da página
  if (to.meta?.title) {
    document.title = to.meta.title
  }

  // Para rotas protegidas, deixar o componente lidar com a auth
  // O router guard só bloqueia se já sabemos que não está autenticado
  if (to.meta?.requiresAuth) {
    const { isLoaded, isSignedIn } = useAuth()

    // Só bloquear se o Clerk já carregou E o usuário não está autenticado
    if (isLoaded.value && !isSignedIn.value) {
      return next('/sign-in')
    }
  }

  // Verificar se rota requer projeto
  if (to.meta?.requiresProject) {
    const projectId = to.params.projectId
    if (projectId) {
      const projectsStore = useProjectsStore()
      const project = projectsStore.projects.find(p => p.id === projectId)

      if (!project) {
        return next('/gallery')
      }

      // Definir projeto atual
      projectsStore.setCurrentProjectId(projectId)
    }
  }

  // Permitir navegação
  next()
})

// Guard após navegação
router.afterEach((to, from) => {
  // Navegação concluída silenciosamente
})

export default router