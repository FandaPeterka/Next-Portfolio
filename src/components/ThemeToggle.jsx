import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const themes = [
  { name: 'elegant-slate', color: '#6c8ebf' },
  { name: 'forest-dawn', color: '#689f38' },
  { name: 'sandstorm', color: '#c3986b' },
  { name: 'midnight-purple', color: '#8e44ad' },
  { name: 'glacier-night', color: '#4a90e2' },
  { name: 'mocha-space', color: '#b56737' },
];

const ThemeToggle = () => {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle">
      {themes.map((th) => (
        <div
          key={th.name}
          className={`theme-toggle-dot ${theme === th.name ? 'active' : ''}`}
          style={{
            backgroundColor: theme === th.name ? th.color : '#b0b0b0',
            boxShadow: theme === th.name ? `0 0 8px 4px ${th.color}` : 'none',
          }}
          onClick={() => changeTheme(th.name)}
        />
      ))}
    </div>
  );
};

export default ThemeToggle;