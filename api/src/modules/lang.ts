import i18next from 'i18next'
import moment from 'moment-timezone'

import {default as zh} from '@common/locales/zh'
import {default as en} from '@common/locales/en'

i18next
.init({
  lng: 'zh',
  fallbackLng: 'en',
  ns: ['base', 'api', 'consumer'],
  defaultNS: 'api',
  resources: {
    zh,
    en
  }
})

i18next
.on('languageChanged', (lng: string) => {
  moment.locale(lng)
})

export { i18next }
