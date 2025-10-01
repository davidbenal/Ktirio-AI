import { useRouter as useVueRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { routes } from '../router/routes.js'

/**
 * Composable que adiciona funcionalidades extras ao Vue Router
 * para manter compatibilidade com a API do hook React
 */
export function useRouter() {
  const router = useVueRouter()
  const route = useRoute()

  const push = (path, options = {}) => {
    if (options.replace) {
      router.replace(path)
    } else {
      router.push(path)
    }
  }

  const replace = (path) => {
    router.replace(path)
  }

  const go = (delta) => {
    router.go(delta)
  }

  const back = () => {
    router.back()
  }

  const forward = () => {
    router.forward()
  }

  const getCurrentRoute = () => {
    return routes.find(routeConfig => {
      if (routeConfig.path === '/:pathMatch(.*)*') return false
      if (routeConfig.path.includes(':')) {
        const pathPattern = routeConfig.path.replace(/:([^/]+)/g, '([^/]+)')
        const regex = new RegExp(`^${pathPattern}$`)
        return regex.test(route.path)
      }
      return routeConfig.path === route.path
    })
  }

  const getRouteByName = (name) => {
    return routes.find(routeConfig => routeConfig.name === name)
  }

  const pushByName = (name, params = {}, options = {}) => {
    const routeConfig = getRouteByName(name)
    if (!routeConfig) {
      console.warn(`Route with name "${name}" not found`)
      return
    }

    if (options.replace) {
      router.replace({ name, params })
    } else {
      router.push({ name, params })
    }
  }

  // Computed properties
  const currentRoute = computed(() => getCurrentRoute())
  const params = computed(() => route.params)
  const query = computed(() => route.query)
  const path = computed(() => route.path)
  const fullPath = computed(() => route.fullPath)

  return {
    push,
    replace,
    go,
    back,
    forward,
    currentRoute,
    params,
    query,
    path,
    fullPath,
    getRouteByName,
    pushByName
  }
}