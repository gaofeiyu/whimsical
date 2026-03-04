import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import JsonRenderer from './core/JsonRenderer.vue'

const app = createApp(App)

// Globally register the JsonRenderer so it can recursively call itself
app.component('JsonRenderer', JsonRenderer)

// Globally register Element Plus
app.use(ElementPlus)

app.mount('#app')
