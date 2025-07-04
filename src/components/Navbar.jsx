"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation }  from "react-i18next";
import { FiMenu, FiX }     from "react-icons/fi";
import { BsLightbulbFill } from "react-icons/bs";

import navbarData       from "../data/dataNavbar";
import ThemeToggle      from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */
const activeDotColor = () => {
  const dot = document.querySelector(".theme-toggle-dot.active");
  if (dot) return getComputedStyle(dot).backgroundColor.trim();

  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--led-on-color")
      .trim() || "#00ffff"
  );
};
const GRAY = "#666";

/* -------------------------------------------------- */
/* Navbar component                                   */
/* -------------------------------------------------- */
const Navbar = ({
  sections,
  activeSection,    // label string
  matrixEnabled,    // bool
  onToggleMatrix,   // () => void
}) => {
  const { t } = useTranslation();

  const [activeMenu, setActiveMenu] = useState(null); // null | "sections" | "languages"
  const [scrollProg, setScrollProg] = useState(0);
  const [bulbColor,  setBulbColor]  = useState(activeDotColor());

  const navRef = useRef(null);

  /* --- color reacts to theme switch ---------------- */
  useEffect(() => {
    const update = () => setBulbColor(activeDotColor());

    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    document.addEventListener("theme-changed", update);
    update(); // init

    return () => {
      mo.disconnect();
      document.removeEventListener("theme-changed", update);
    };
  }, []);

  /* --- scroll progress bar ------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const h   = document.documentElement.scrollHeight - innerHeight;
      setScrollProg(h > 0 ? top / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- click-outside: zavře pouze pokud netrefíme navbar ani language-dropdown */
  useEffect(() => {
    const close = (e) => {
      if (
        !navRef.current?.contains(e.target) &&
        !e.target.closest(".language-dropdown")
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  /* --- smooth scroll helper ------------------------ */
  const scrollTo = (r) => {
    r?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveMenu(null);
  };

  /* -------------------------------------------------- */
  return (
    <nav className="navbar" ref={navRef} aria-label="Primary Navigation">
      {/* BRAND + bulb */}
      <div className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <img src={navbarData.brandIcon} alt="Developer icon" />
        <p>
          {t(navbarData.brandText)}
          <span className="brand-subtext"> | {t(navbarData.brandSubText)}</span>
        </p>

        <button
          type="button"
          onClick={onToggleMatrix}
          title={matrixEnabled ? t("Vypnout animované pozadí") : t("Zapnout animované pozadí")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <BsLightbulbFill
            size={30}
            style={{
              color: matrixEnabled ? bulbColor : GRAY,
              fill:  matrixEnabled ? bulbColor : GRAY,
              filter: matrixEnabled ? `drop-shadow(0 0 6px ${bulbColor})` : "none",
              transition: "all .25s",
            }}
          />
        </button>
      </div>

      {/* DESKTOP */}
      <div className="navbar-center desktop">
        {sections.map(({ label, ref }, idx) => (
          <React.Fragment key={label}>
            <button
              onClick={() => scrollTo(ref)}
              className={`navbar-link ${activeSection === label ? "active" : ""}`}
              aria-current={activeSection === label ? "page" : undefined}
            >
              {t(label)}
            </button>
            {idx !== sections.length - 1 && (
              <span className="navbar-separator">{t(navbarData.separator)}</span>
            )}
          </React.Fragment>
        ))}

        <div className="navbar-switchers">
          <ThemeToggle />
          {/* desktop language switcher */}
          <LanguageSwitcher
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </div>
      </div>

      {/* MOBILE */}
      <div className="navbar-right mobile">
        {/* language switcher (mobile) */}
        <LanguageSwitcher
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <ThemeToggle />

        <button
          type="button"
          className="mobile-menu-icon"
          aria-label={activeMenu === "sections" ? t("Zavřít menu") : t("Otevřít menu")}
          aria-expanded={activeMenu === "sections"}
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu((m) => (m === "sections" ? null : "sections"));
          }}
        >
          {activeMenu === "sections" ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {activeMenu === "sections" && (
          <div className="mobile-dropdown mobile" role="menu">
            {sections.map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => scrollTo(ref)}
                className={`dropdown-link ${activeSection === label ? "active" : ""}`}
                role="menuitem"
              >
                {t(label)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div
        className="scroll-progress-bar"
        aria-hidden="true"
        style={{
          transform: `scaleX(${scrollProg})`,
          transformOrigin: "left center",
        }}
      />
    </nav>
  );
};

export default Navbar;