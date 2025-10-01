import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import router from './router.js'
import './style.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error(
    "Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file"
  )
}

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(clerkPlugin, {
  publishableKey: clerkPubKey
})

app.mount('#root')