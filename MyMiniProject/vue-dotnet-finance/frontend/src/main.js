import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { AuthPlugin, initAuth } from './auth'
import './style.css'

await initAuth()

createApp(App).use(router).use(AuthPlugin).mount('#app')
