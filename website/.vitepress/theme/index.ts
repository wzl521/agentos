import DefaultTheme from 'vitepress/theme'
import HomeSections from './components/HomeSections.vue'

import '@fontsource-variable/lexend'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeSections', HomeSections)
  },
}
