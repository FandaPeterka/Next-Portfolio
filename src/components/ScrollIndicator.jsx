"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";                         // dál zůstává jen pro puls šipky
import scrollIndicatorData from "../data/dataScrollIndicator";
import { ThemeContext } from "../contexts/ThemeContext";

const DARK_TEXT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];
const REF_HEIGHT = 800;
const PX_PER_100 = 25;

export default function ScrollIndicator() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  /* refs & state */
  const indicatorRef = useRef(null);
  const iconRef   = useRef(null);

  const [isActive, setActive] = useState(false);
  const [imgShift, setShift]  = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);   // ← pro CSS fade-in

  /* motiv-specific assets */
  const arrowColor = DARK_TEXT_THEMES.includes(theme) ? "#000" : "#fff";
  const imgSrc     = DARK_TEXT_THEMES.includes(theme) ? "/mac-me2.png" : "/mac-me.png";
  const bubbleSrc  = DARK_TEXT_THEMES.includes(theme) ? "/textbubble2.png" : "/textbubble.png";

  /* posun foto + bubliny */
  useEffect(() => {
    const recalc = () => {
      const delta = window.innerHeight - REF_HEIGHT;
      setShift((delta / 100) * PX_PER_100);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  /* IntersectionObserver: šipka animace ON/OFF */
  const observerCb = useCallback(([e]) => setActive(e.isIntersecting), []);
  useEffect(() => {
    const obs = new IntersectionObserver(observerCb, { threshold: 0.5 });
    indicatorRef.current && obs.observe(indicatorRef.current);
    return () => obs.disconnect();
  }, [observerCb]);

  /* GSAP – puls šipky, text jsme zrušili */
  useEffect(() => {
    if (!iconRef.current) return;
    let tween;
    if (isActive) {
      tween = gsap.to(iconRef.current, {
        y: 20,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    } else {
      gsap.killTweensOf(iconRef.current);
      gsap.set(iconRef.current, { y: 0 });
    }
    return () => tween?.kill();
  }, [isActive]);

  /* CSS fade-in bubliny – spusť jen jednou po mountu */
  useEffect(() => {
    // krátká prodleva zajistí, že počáteční opacity/transform se aplikuje,
    // pak se přepne bubbleVisible → true a přechod naběhne
    const id = requestAnimationFrame(() => setBubbleVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* SVG šipka (bílá/černá) */
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
      role="presentation"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* foto + bublina */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          transform: `translateY(${imgShift}px)`,
          transition: "transform .3s ease-out",
        }}
      >
        <img
          src={imgSrc}
          alt={t("Moje fotografie")}
          loading="lazy"
          style={{
            width: "70vw",
            maxWidth: "500px",
            height: "auto",
            display: "block",
          }}
        />

        {/* bublina vpravo nahoře – fade-in přes CSS transition */}
        <img
          src={bubbleSrc}
          alt={t("Dekorativní bublina")}
          loading="lazy"
          style={{
            position: "absolute",
            top: "-12%",
            right: "-30%",
            width: "55%",
            maxWidth: "260px",
            height: "auto",
            pointerEvents: "none",

            /* ▼ CSS animace */
            opacity: bubbleVisible ? 1 : 0,
            transform: bubbleVisible
              ? "translateX(0)"
              : "translateX(120px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        />
      </div>

      {/* pulsující šipka */}
      <div ref={iconRef} aria-hidden="true">
        {arrowSvg}
      </div>
    </div>
  );
}