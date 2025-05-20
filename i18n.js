import { createI18n } from 'vue-i18n'
import messages from './locales/index.js'

const localeFromStorage = localStorage.getItem('locale') || 'vi'

const i18n = createI18n({
    legacy: false,
    locale: localeFromStorage,
    fallbackLocale: 'en',
    messages
})


export default i18n
