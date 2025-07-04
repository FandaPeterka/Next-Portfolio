"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import navbarData from "../data/dataNavbar";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = ({ sections, activeSection }) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setActiveMenu(null);
    }
  };

  const toggleSectionsMenu = (e) => {
    e.stopPropagation();
    setTimeout(() => {
      setActiveMenu((prev) => (prev === "sections" ? null : "sections"));
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef} aria-label="Primary Navigation">
      {/* Levá část: ikona a značka */}
      <div className="navbar-brand">
        <img src={navbarData.brandIcon} alt="Developer Icon" />
        <p>
          {t(navbarData.brandText)}&nbsp;
          <span className="brand-subtext">
            |&nbsp;{t(navbarData.brandSubText)}
          </span>
        </p>
      </div>

      {/* Desktop – odkazy + přepínače (theme a jazyk) */}
      <div className="navbar-center desktop">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => scrollToSection(section.ref)}
              className={`navbar-link ${activeSection === section.label ? "active" : ""}`}
              aria-current={activeSection === section.label ? "page" : undefined}
            >
              {t(section.label)}
            </button>
            {index !== sections.length - 1 && (
              <span className="navbar-separator">{t(navbarData.separator)}</span>
            )}
          </React.Fragment>
        ))}
        <div className="navbar-switchers">
          <ThemeToggle />
          <LanguageSwitcher activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>
      </div>

      {/* Mobilní část – zobrazuje se pouze v mobile (podle CSS media queries) */}
      <div className="navbar-right mobile">
        <LanguageSwitcher activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <ThemeToggle />
        <div
          className="mobile-menu-icon"
          onClick={toggleSectionsMenu}
          role="button"
          tabIndex="0"
          aria-label="Toggle navigation dropdown"
        >
          {activeMenu === "sections" ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        {/* Mobilní dropdown se sekcemi */}
        {activeMenu === "sections" && (
          <div className="mobile-dropdown mobile" role="menu">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(section.ref)}
                className={`dropdown-link ${activeSection === section.label ? "active" : ""}`}
                role="menuitem"
                aria-current={activeSection === section.label ? "page" : undefined}
              >
                {t(section.label)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progresní linka – vizuální indikátor scrollu, skrytý před čtečkami obrazovky */}
      <div
        className="scroll-progress-bar"
        aria-hidden="true"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left center",
        }}
      />
    </nav>
  );
};

export default Navbar;