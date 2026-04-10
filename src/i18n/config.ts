import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './translations/en/en.json';
import esTranslation from './translations/es/es.json';
import caTranslation from './translations/ca/ca.json';

export const defaultNS = 'translation';

export const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  ca: { translation: caTranslation },
} as const;

const isBrowser = typeof window !== 'undefined';

const i18nInstance = i18n;

if (isBrowser) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'ca'],
    interpolation: {
      escapeValue: false,
    },
    detection: isBrowser ? {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    } : undefined,
    react: {
      useSuspense: false, //ssr
    }
  });

export default i18nInstance;
