"use client"

import React, { createContext, useCallback } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18nInstance from '../config';

export type Language = 'es' | 'en' | 'ca';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nextT } = useTranslation(undefined, { i18n: i18nInstance });

  const language = (i18nInstance.language?.split('-')[0] || (i18nInstance.options.fallbackLng as any)?.[0] || 'en') as Language;

  const setLanguage = useCallback((lang: Language) => {
    i18nInstance.changeLanguage(lang);
  }, []);

  // Bridge function: maintains backward compatibility with existing t('section.key', { param }) calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = i18nextT as any;
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (params) {
      return tAny(key, params) as string;
    }
    return tAny(key) as string;
  }, [tAny]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <I18nContext.Provider value={{ language, setLanguage, t }}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
};

export default I18nContext;
