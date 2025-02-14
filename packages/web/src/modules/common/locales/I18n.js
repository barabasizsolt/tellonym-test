import en from '@tellonym/strings/app/en.json'
import I18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

I18n.use(LanguageDetector).init({
  fallbackLng: 'en',
  debug: process.env.REACT_APP_ENV === 'development',
  resources: {
    en: { translation: en },
  },
})

export { I18n }
