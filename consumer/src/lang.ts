import i18n from 'i18next'
import {LOCALES} from '@common'

i18n.init({
  lng: 'zh',
  resources: {
    en: {
      translation: LOCALES.en
    },
    zh: {
      translation: LOCALES.zh
    }
  }
})

export const LANG = i18n