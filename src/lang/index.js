import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import zh from './zh'
import Cookies from 'vue-cookies'

Vue.use(VueI18n)

const messages = {
  en: {
    ...en
  },
  zh: {
    ...zh
  }
}
export function getLanguage () {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage
  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh'
}

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'en',
  messages
})

export default i18n
