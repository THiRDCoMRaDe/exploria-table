import './assets/styles/utilities.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueVirtualScroller from 'vue-virtual-scroller'

const app = createApp(App)
app.use(router)
app.use(VueVirtualScroller)
app.mount('#app')
