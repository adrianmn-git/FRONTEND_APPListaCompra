"use client"

import React, { createContext, useState, useEffect, useCallback } from 'react';
import es from '../translations/es.json';
import en from '../translations/en.json';
import ca from '../translations/ca.json';

export type Language = 'es' | 'en' | 'ca';

const translations = { es, en, ca };

type TranslationData = typeof es;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['es', 'en', 'ca'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['es', 'en', 'ca'].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[language];

    // Extract defaultValue before processing
    const defaultValue = params?.defaultValue as string | undefined;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Use defaultValue fallback, then raw key
        return defaultValue ? String(defaultValue) : key;
      }
    }

    if (typeof result !== 'string') {
      return defaultValue ? String(defaultValue) : key;
    }

    // Handle interpolation {{name}} (exclude defaultValue)
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        if (paramKey !== 'defaultValue') {
          result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
        }
      });
    }

    return result;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;
