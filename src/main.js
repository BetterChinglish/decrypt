import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'vant/lib/index.css'

import JsonViewer from "vue3-json-viewer";
import 'vue3-json-viewer/dist/index.css';
createApp(App)
    .use(store)
    .use(router)
    .use(JsonViewer)
    .mount('#app')
