"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
  { code: 'cs', label: 'CZ' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  }, [i18n]);

  const toggleOpen = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const currentLanguage = useMemo(() => {
    return languages.find(lang => lang.code === i18n.language)?.label || 'EN';
  }, [i18n.language]);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="language-switcher" ref={dropdownRef} role="menu" aria-label="Language Switcher">
      <button 
        onClick={toggleOpen} 
        className="lang-btn" 
        aria-haspopup="true" 
        aria-expanded={open}
      >
        {currentLanguage}
      </button>
      {open && (
        <ul className="language-dropdown" role="menu">
          {languages.map(lang => (
            <li 
              key={lang.code} 
              onClick={() => changeLanguage(lang.code)} 
              className="language-option"
              role="menuitem"
              tabIndex="0"
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(LanguageSwitcher);