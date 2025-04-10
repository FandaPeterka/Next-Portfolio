"use client";
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const themes = [
  { name: 'elegant-slate', color: '#6c8ebf' },
  { name: 'forest-dawn', color: '#689f38' },
  { name: 'sandstorm', color: '#c3986b' },
  { name: 'midnight-purple', color: '#8e44ad' },
  { name: 'glacier-night', color: '#4a90e2' },
  { name: 'mocha-space', color: '#b56737' },
];

const ThemeToggleDot = React.memo(({ themeItem, currentTheme, onChangeTheme }) => {
  const handleClick = useCallback(() => {
    onChangeTheme(themeItem.name);
  }, [onChangeTheme, themeItem.name]);

  const dotStyle = useMemo(
    () => ({
      backgroundColor: currentTheme === themeItem.name ? themeItem.color : '#b0b0b0',
      boxShadow: currentTheme === themeItem.name ? `0 0 8px 4px ${themeItem.color}` : 'none',
    }),
    [currentTheme, themeItem.name, themeItem.color]
  );

  return (
    <div
      className={`theme-toggle-dot ${currentTheme === themeItem.name ? 'active' : ''}`}
      style={dotStyle}
      onClick={handleClick}
      role="button"
      tabIndex="0"
      aria-label={`Switch to ${themeItem.name} theme`}
    />
  );
});

const ThemeToggle = () => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="theme-toggle" role="group" aria-label="Theme Toggle">
      {themes.map((th) => (
        <ThemeToggleDot
          key={th.name}
          themeItem={th}
          currentTheme={theme}
          onChangeTheme={changeTheme}
        />
      ))}
    </div>
  );
};

export default React.memo(ThemeToggle);