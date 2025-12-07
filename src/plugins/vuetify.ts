import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '../style.css'

export default createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'customTheme',

    themes: {
      customTheme: {
        dark: false,
        colors: {
          primary: '#372B73',
          primaryLight: '#4A3D8D',
          primaryDark: '#241A4E',

          secondary: '#A67C52',
          secondaryLight: '#C89F77',
          secondaryDark: '#7D5B3C',

          background: '#F5F5F0',
          surface: '#FFFFFF',

          textPrimary: '#241A4E',
          textSecondary: '#4B4B4B',
          textSoft: '#6A6A6A',

          border: '#C89F77',

          accent: '#B7E4C7',
          accentSoft: '#D3F2DE',
          accentMedium: '#87C7A3',

          success: '#B7E4C7',
          warning: '#C89F77',
          error: '#D9534F',
        },
      },

      customThemeDark: {
        dark: true,
        colors: {
          primary: '#372B73',
          primaryLight: '#4A3D8D',
          primaryDark: '#241A4E',

          secondary: '#A67C52',
          secondaryLight: '#C89F77',
          secondaryDark: '#7D5B3C',

          background: '#1B1A1F',
          surface: '#24232A',

          textPrimary: '#EFEFEF',
          textSecondary: '#CFCFCF',
          textSoft: '#A9A9A9',

          border: '#3A3940',

          accent: '#B7E4C7',
          accentSoft: '#D3F2DE',
          accentMedium: '#87C7A3',

          success: '#B7E4C7',
          warning: '#C89F77',
          error: '#D9534F',
        },
      },
    },
  },
})
