import './globals'
import './modules/common/assets/fontello/css/fontello.css'
import { loadLocales } from './modules/common/locales/localesLoader'
import { loadPolyfills } from './modules/common/polyfills'

loadPolyfills()
  .then(() => loadLocales())
  .then(() => import('./init'))
  .then(() => import('./Root'))
