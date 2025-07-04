import React from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";

const languages = [
  { code: "cs", label: "CZ" },
  { code: "en", label: "EN" },
];

const LanguageSwitcher = ({ activeMenu, setActiveMenu }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setActiveMenu(null);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language)?.label || "EN";

  // Toggle dropdownu language switcheru – zastavíme propagaci kliknutí
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setActiveMenu((prev) => (prev === "language" ? null : "language"));
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={toggleDropdown}
        className="lang-btn"
        aria-haspopup="menu"
        aria-expanded={activeMenu === "language"}
      >
        {activeMenu === "language" ? <FiX size={20} /> : currentLanguage}
      </button>
      {activeMenu === "language" && (
        <ul className="language-dropdown" role="menu">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="language-option"
              role="menuitem"
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;