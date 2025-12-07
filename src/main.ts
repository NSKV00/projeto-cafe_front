import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/Routes.ts'
import './style.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import vuetify from './plugins/vuetify'
import longpress from './directives/longpress'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.directive('longpress', longpress)
app.mount('#app')

export { toast }