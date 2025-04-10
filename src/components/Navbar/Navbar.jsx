"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import navbarData from "../../data/dataNavbar";
import NavbarBrand from "./NavbarBrand";
import NavbarDesktopLinks from "./NavbarDesktopLinks";
import NavbarSwitchers from "./NavbarSwitchers";
import NavbarMobile from "./NavbarMobile";
import "./Navbar.css";

const Navbar = ({ sections, activeSection }) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToSection = useCallback((ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopLinks = useMemo(() => (
    sections.map((section, index) => (
      <React.Fragment key={index}>
        <button
          onClick={() => scrollToSection(section.ref)}
          className={`navbar-link ${activeSection === section.label ? "active" : ""}`}
          aria-label={`Go to ${t(section.label)} section`}
        >
          {t(section.label)}
        </button>
        {index !== sections.length - 1 && (
          <span className="navbar-separator">{t(navbarData.separator)}</span>
        )}
      </React.Fragment>
    ))
  ), [sections, activeSection, scrollToSection, t]);

  const mobileLinks = useMemo(() => (
    sections.map((section, index) => (
      <button
        key={index}
        onClick={() => scrollToSection(section.ref)}
        className={`dropdown-link ${activeSection === section.label ? "active" : ""}`}
        aria-label={`Go to ${t(section.label)} section`}
      >
        {t(section.label)}
      </button>
    ))
  ), [sections, activeSection, scrollToSection, t]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <NavbarBrand
        brandIcon={navbarData.brandIcon}
        brandText={t(navbarData.brandText)}
        brandSubText={t(navbarData.brandSubText)}
      />

      <div className="navbar-center desktop">
        <NavbarDesktopLinks desktopLinks={desktopLinks} />
        <NavbarSwitchers />
      </div>

      <div className="navbar-right mobile">
        <NavbarSwitchers />
        <NavbarMobile menuOpen={menuOpen} toggleMenu={toggleMenu} mobileLinks={mobileLinks} />
      </div>

      <div
        className="scroll-progress-bar"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left center"
        }}
        aria-hidden="true"
      />
    </nav>
  );
};

export default React.memo(Navbar);