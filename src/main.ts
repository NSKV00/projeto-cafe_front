import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import router from './routes/Routes.ts'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#6a11cb',
          secondary: '#2575fc',
          background: '#1a1a1a',
          surface: '#1a1a1a',
        }
      }
    }
  }
})


createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
