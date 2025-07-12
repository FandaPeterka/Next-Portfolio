/* =========================================================
   ScrollIndicator.jsx – klik přenese na další sekci
   (aktivní pouze šipka)
   ========================================================= */
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
import gsap from "gsap";
import { ThemeContext } from "../contexts/ThemeContext";

const DARK_TEXT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];
const REF_HEIGHT   = 800;
const PX_PER_100   = 25;
const SMALL_BP     = 480;
const SMALL_SHIFT  = -100;

export default function ScrollIndicator({ nextRef }) {
  const { t }  = useTranslation();
  const { theme } = useContext(ThemeContext);

  const indicatorRef = useRef(null);
  const iconRef      = useRef(null);

  const [isActive, setActive]         = useState(false);
  const [shiftY,   setShiftY]         = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const imgSrc    = "/mac-me.webp";
  const bubbleSrc = "/textbubble.webp";

  const isDark    = DARK_TEXT_THEMES.includes(theme);
  const imgFilter = isDark ? "invert(1)" : "invert(0)";
  const arrowColor = isDark ? "#000" : "#fff";

  /* ------- přepočet posunu obrázku ----------------------------------- */
  useEffect(() => {
    const recalc = () => {
      const deltaH     = window.innerHeight - REF_HEIGHT;
      const baseShift  = (deltaH / 100) * PX_PER_100;
      const extraShift = window.innerWidth < SMALL_BP ? SMALL_SHIFT : 0;
      setShiftY(baseShift + extraShift);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  /* ------- IntersectionObserver – puls šipky ------------------------- */
  const observerCb = useCallback(([e]) => setActive(e.isIntersecting), []);
  useEffect(() => {
    const obs = new IntersectionObserver(observerCb, { threshold: 0.5 });
    indicatorRef.current && obs.observe(indicatorRef.current);
    return () => obs.disconnect();
  }, [observerCb]);

  /* ------- GSAP animace šipky ---------------------------------------- */
  useEffect(() => {
    if (!iconRef.current) return;
    let tw;
    if (isActive) {
      tw = gsap.to(iconRef.current, {
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
    return () => tw?.kill();
  }, [isActive]);

  /* ------- Fade-in bubliny ------------------------------------------- */
  useEffect(() => {
    const id = requestAnimationFrame(() => setBubbleVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ------- SVG šipka -------------------------------------------------- */
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

  /* ------- CLICK – jen na šipce -------------------------------------- */
  const handleClick = () => {
    nextRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* --------------------------- render -------------------------------- */
  return (
    <div
      ref={indicatorRef}
      className="scroll-indicator"
      role="presentation"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* obrázek + bublina – neklikací */}
      <div
        className="si-figure"
        style={{
          position: "relative",
          display: "inline-block",
          transform: `translateY(${shiftY}px)`,
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
            filter: imgFilter,
          }}
        />

        <img
          src={bubbleSrc}
          alt={t("Dekorativní bublina")}
          loading="lazy"
          style={{
            position: "absolute",
            top: "-25%",
            right: "-30%",
            width: "55%",
            maxWidth: "260px",
            height: "auto",
            pointerEvents: "none",
            opacity: bubbleVisible ? 1 : 0,
            transform: bubbleVisible ? "translateX(0)" : "translateX(120px)",
            transition: "opacity 1s ease-out, transform 1s ease-out, filter 0.3s",
            filter: imgFilter,
          }}
        />
      </div>

      {/* klikací šipka */}
      <div
        ref={iconRef}
        className="si-arrow"
        aria-hidden="true"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {arrowSvg}
      </div>
    </div>
  );
}