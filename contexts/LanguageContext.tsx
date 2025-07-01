
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Language, Translations } from '../types';
import { UI_TEXT } from '../constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem('herPathLanguage') as Language;
    return storedLang || Language.EN;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('herPathLanguage', lang);
  };

  const translate = useCallback((key: string, defaultText?: string): string => {
    const translationsForKey = UI_TEXT[key];
    if (translationsForKey && translationsForKey[language]) {
      return translationsForKey[language];
    }
    return defaultText || key; // Fallback to key or provided default
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
    