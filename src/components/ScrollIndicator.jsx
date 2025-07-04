"use client";

import React, {
  useRef, useEffect, useState, useMemo, useCallback, useContext,
} from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import scrollIndicatorData from "../data/dataScrollIndicator";
import { ThemeContext } from "../contexts/ThemeContext";

const DARK_TEXT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];
const REF_HEIGHT = 800;
const PX_PER_100 = 25;

export default function ScrollIndicator({
  text = scrollIndicatorData.defaultText,
}) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  /* refs & state */
  const indicatorRef = useRef(null);
  const iconRef      = useRef(null);
  const textRef      = useRef(null);

  const [isActive, setActive] = useState(false);
  const [imgShift, setShift]  = useState(0);

  /* ► bílá vs. černá šipka */
  const arrowColor = DARK_TEXT_THEMES.includes(theme) ? "#000000" : "#ffffff";
  const imgSrc     = DARK_TEXT_THEMES.includes(theme) ? "/mac-me2.png" : "/mac-me.png";

  /* posun fotky při změně výšky okna */
  useEffect(() => {
    const recalc = () => {
      const delta = window.innerHeight - REF_HEIGHT;
      setShift((delta / 100) * PX_PER_100);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  /* IntersectionObserver */
  const observerCb = useCallback(([e]) => setActive(e.isIntersecting), []);
  useEffect(() => {
    const obs = new IntersectionObserver(observerCb, { threshold: 0.5 });
    indicatorRef.current && obs.observe(indicatorRef.current);
    return () => obs.disconnect();
  }, [observerCb]);

  /* GSAP animace */
  useEffect(() => {
    if (!iconRef.current || !textRef.current) return;
    let tw1, tw2;
    if (isActive) {
      tw1 = gsap.to(iconRef.current, { y: 20, duration: 0.9, repeat: -1, yoyo: true, ease: "power1.inOut" });
      tw2 = gsap.to(textRef.current, { opacity: 0, duration: 1.6, repeat: -1, yoyo: true, ease: "power1.inOut" });
    } else {
      gsap.killTweensOf([iconRef.current, textRef.current]);
      gsap.set(iconRef.current, { y: 0 });
      gsap.set(textRef.current, { opacity: 1 });
    }
    return () => { tw1?.kill(); tw2?.kill(); };
  }, [isActive]);

  /* SVG šipka – pouze #fff nebo #000 */
  const arrowSvg = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={arrowColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    [arrowColor]
  );

  /* render */
  return (
    <div
      ref={indicatorRef}
      className="scroll-indicator"
      role="status"
      aria-live="polite"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={imgSrc}
        alt={t("Moje fotografie")}
        loading="lazy"
        style={{
          width: "70vw",
          maxWidth: "500px",
          height: "auto",
          marginBottom: "3rem",
          transform: `translateY(${imgShift}px)`,
          transition: "transform .3s ease-out",
        }}
      />

      <div ref={iconRef} aria-hidden="true">{arrowSvg}</div>
      <div
        ref={textRef}
        /* <<< změněné styly ----------------------------- */
        style={{
          marginTop: "0.75rem",
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontWeight: 600,
          /* o něco větší, ale responsivní: 1rem → 1.25rem */
          fontSize: "clamp(1rem, 1.1vw + 0.9rem, 1.25rem)",
          letterSpacing: "0.02em",
        }}
      >
        {t(text)}
      </div>
      </div>
  );
}