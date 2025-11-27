/**
 * LanguageSwitcher.tsx
 *
 * Dropdown component for switching between English and Arabic.
 * - Neobrutalist styling to match the app
 * - Shows current language with globe icon
 * - Saves preference to localStorage
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Language options
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - compact with just icon and flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 bg-white rounded-xl border-2 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-brand-dark"
        style={{ boxShadow: getRtlShadow('sm', isRTL) }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('switchLanguage')}
      >
        <Globe className="h-4 w-4" />
        <span className="text-base">{currentLang.flag}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 z-50 min-w-[140px] bg-white rounded-xl border-2 border-brand-dark overflow-hidden"
          style={{ boxShadow: getRtlShadow('md', isRTL) }}
        >
          <ul role="listbox" className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left rtl:text-right font-body-medium text-sm transition-colors ${
                    language === lang.code
                      ? 'bg-brand-coral/10 text-brand-coral'
                      : 'text-brand-dark hover:bg-brand-cream'
                  }`}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto rtl:ml-0 rtl:mr-auto text-brand-coral">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
