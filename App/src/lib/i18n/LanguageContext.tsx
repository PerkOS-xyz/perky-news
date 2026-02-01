'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { LanguageCode, translations, getTranslation } from './translations';
// useRouter/usePathname removed - using window.location directly for reliability

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialLocale?: LanguageCode;
}

export function LanguageProvider({ children, initialLocale = 'en' }: Props) {
  const language = initialLocale;

  const setLanguage = (lang: LanguageCode) => {
    // Set cookie for middleware
    document.cookie = `perky-lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
    
    // Navigate to new locale path
    // Use window.location.pathname directly for reliability
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    segments[1] = lang; // Replace locale segment
    const newPath = segments.join('/');
    
    // Full page navigation to ensure server components refresh
    window.location.href = newPath;
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
