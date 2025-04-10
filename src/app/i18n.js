// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../data/locales/en.json';
import csTranslations from '../data/locales/cs.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      cs: { translation: csTranslations }
    },
    lng: 'cs',            // Výchozí jazyk – můžete to změnit
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;