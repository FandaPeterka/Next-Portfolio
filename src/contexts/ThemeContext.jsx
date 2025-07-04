"use client";
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicializace s null, dokud se nepřečte hodnota z localStorage
  const [theme, setTheme] = useState(null);

  // Načtení tématu z localStorage až na klientovi
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      // Pokud v localStorage není uloženo žádné téma, použijeme default
      setTheme(storedTheme || 'elegant-slate');
    }
  }, []);

  // Aktualizace atributu na <html> a synchronizace localStorage až když je theme načteno
  useEffect(() => {
    if (theme && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Synchronizace změn v localStorage (v případě otevření více záložek)
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'theme' && event.newValue) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Dokud se téma nenačte, můžeme vrátit null nebo jednoduchý placeholder
  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};