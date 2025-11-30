
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import router from './routes/Routes.ts'
import vuetify from './plugins/vuetify'

createApp(App)
    .use(router)
    .use(vuetify)
  .mount('#app')
