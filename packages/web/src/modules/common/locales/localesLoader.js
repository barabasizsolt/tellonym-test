import { config } from '../../../config'
import { I18n } from './I18n'
import { moment } from './moment'

const { browserLanguage } = config.__app__

const changeLanguage =
  (lang) =>
  ({ default: locale }) =>
    new Promise((resolve) => {
      moment.locale(lang)
      I18n.addResourceBundle(lang, 'translation', locale)
      I18n.changeLanguage(lang, resolve)
    })

export const loadLocales = (lang = browserLanguage) =>
  lang === 'de'
    ? import('./de').then(changeLanguage('de'))
    : lang === 'es'
    ? import('./es').then(changeLanguage('es'))
    : lang === 'fr'
    ? import('./fr').then(changeLanguage('fr'))
    : lang === 'it'
    ? import('./it').then(changeLanguage('it'))
    : lang === 'pt'
    ? import('./pt').then(changeLanguage('pt'))
    : lang === 'ro'
    ? import('./ro').then(changeLanguage('ro'))
    : lang === 'ru'
    ? import('./ru').then(changeLanguage('ru'))
    : lang === 'sv'
    ? import('./sv').then(changeLanguage('sv'))
    : lang === 'tr'
    ? import('./tr').then(changeLanguage('tr'))
    : Promise.resolve()
