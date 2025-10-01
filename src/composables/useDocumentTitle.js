import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { routes } from '../router/routes.js'

/**
 * Composable que gerencia o título do documento baseado na rota atual
 */
export function useDocumentTitle() {
  const route = useRoute()

  const updateDocumentTitle = () => {
    const currentRoute = routes.find(routeConfig => {
      if (routeConfig.path === '/:pathMatch(.*)*') return false
      if (routeConfig.path.includes(':')) {
        const pathPattern = routeConfig.path.replace(/:([^/]+)/g, '([^/]+)')
        const regex = new RegExp(`^${pathPattern}$`)
        return regex.test(route.path)
      }
      return routeConfig.path === route.path
    })

    if (currentRoute?.meta?.title) {
      document.title = currentRoute.meta.title
    } else {
      document.title = 'Ktírio - Virtual Home Staging AI'
    }

    if (currentRoute?.meta?.description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', currentRoute.meta.description)
    }
  }

  // Observa mudanças na rota e atualiza o título
  watch(() => route.path, updateDocumentTitle, { immediate: true })

  return {
    updateDocumentTitle
  }
}