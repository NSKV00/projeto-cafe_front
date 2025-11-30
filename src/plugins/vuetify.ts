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
          primary: 'var(--color-primary)',
          primaryLight: 'var(--color-primary-light)',
          primaryDark: 'var(--color-primary-dark)',

          secondary: 'var(--color-secondary)',
          secondaryLight: 'var(--color-secondary-light)',
          secondaryDark: 'var(--color-secondary-dark)',

          background: 'var(--background-main)',
          surface: 'var(--background-surface)',

          textPrimary: 'var(--text-primary)',
          textSecondary: 'var(--text-secondary)',
          textSoft: 'var(--text-soft)',

          border: 'var(--border-color)',

          accent: 'var(--color-accent)',
          accentSoft: 'var(--color-accent-soft)',
          accentMedium: 'var(--color-accent-medium)',

          success: 'var(--success-color)',
          warning: 'var(--warning-color)',
          error: 'var(--error-color)',
        },
      },

      customThemeDark: {
        dark: true,
        colors: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',

          background: 'var(--dark-background)',
          surface: 'var(--dark-surface)',

          textPrimary: 'var(--dark-text-primary)',
          textSecondary: 'var(--dark-text-secondary)',

          border: 'var(--dark-border-color)',

          accent: 'var(--color-accent-medium)',
          accentSoft: 'var(--color-accent-soft)',

          success: 'var(--success-color)',
          warning: 'var(--warning-color)',
          error: 'var(--error-color)',
        },
      },
    },
  },
})
