"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Language } from '../contexts/I18nContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
  compact?: boolean;
  align?: 'left' | 'right';
}

const LANGUAGES: { code: Language; name: string; flagClass: string }[] = [
  { code: 'es', name: 'Español', flagClass: 'fi-es' },
  { code: 'en', name: 'English', flagClass: 'fi-gb' },
  { code: 'ca', name: 'Català', flagClass: 'fi-es-ct' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header', compact = false, align = 'right' }) => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHeader = variant === 'header';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl font-black text-xs uppercase transition-all duration-300 active:scale-95 cursor-pointer
          ${isHeader 
            ? 'bg-white/50 backdrop-blur-md border border-white hover:bg-white hover:shadow-lg shadow-slate-200/50 text-slate-600' 
            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
          }
        `}
      >
        <span className={`fi ${currentLang.flagClass} text-lg rounded-sm shadow-sm opacity-90`} />
        {!compact && <span className="hidden sm:inline">{currentLang.name}</span>}
        {!compact && <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {isOpen && (
        <div className={`
          absolute z-[100] w-48 mt-2 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200
          ${isHeader 
            ? (compact 
                ? 'left-full top-0 ml-4 mt-0 bg-white border-slate-100 shadow-indigo-200/50' 
                : `${align === 'left' ? 'left-0 right-auto' : 'right-0 left-auto'} top-full bg-white border-slate-100`
              )
            : 'left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-800 border-slate-700'
          }
        `}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-3 w-full px-4 py-3 text-sm font-bold transition-colors cursor-pointer
                ${isHeader
                  ? (language === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50')
                  : (language === lang.code ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700')
                }
              `}
            >
              <span className={`fi ${lang.flagClass} text-lg rounded-sm shadow-sm`} />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
