"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import scrollIndicatorData from "../data/dataScrollIndicator";

const REF_HEIGHT = 800;        // referenční výška viewportu
const PX_PER_100 = 25;         // kolik px posunout za +/-100 px rozdílu

const ScrollIndicator = ({ text = scrollIndicatorData.defaultText }) => {
  const { t } = useTranslation();

  /* ───────── refs & state ───────── */
  const indicatorRef = useRef(null);
  const iconRef      = useRef(null);
  const textRef      = useRef(null);
  const [isActive, setActive]   = useState(false); // šipka animuje / stojí
  const [imgShift,  setShift]   = useState(0);     // translateY fotky

  /* ───────── fotku posouváme podle velikosti okna ───────── */
  useEffect(() => {
    const recalcShift = () => {
      const delta = window.innerHeight - REF_HEIGHT;     // ± px
      setShift((delta / 100) * PX_PER_100);              // lineární map
    };
    recalcShift();                       // init
    window.addEventListener("resize", recalcShift);
    return () => window.removeEventListener("resize", recalcShift);
  }, []);

  /* ───────── SVG šipka (memo) ───────── */
  const arrowSvg = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    []
  );

  /* ───────── IntersectionObserver ───────── */
  const observerCallback = useCallback(
    (entries) => {
      entries.forEach((entry) =>
        setActive(entry.isIntersecting)
      );
    },
    []
  );

  useEffect(() => {
    const obs = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    indicatorRef.current && obs.observe(indicatorRef.current);
    return () => obs.disconnect();
  }, [observerCallback]);

  /* ───────── animace ↔ stop ───────── */
  useEffect(() => {
    if (!iconRef.current || !textRef.current) return;

    let tw1, tw2;
    if (isActive) {
      tw1 = gsap.to(iconRef.current, {
        y: 20,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
      tw2 = gsap.to(textRef.current, {
        opacity: 0,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    } else {
      gsap.killTweensOf([iconRef.current, textRef.current]);
      gsap.set(iconRef.current, { y: 0 });
      gsap.set(textRef.current, { opacity: 1 });
    }
    return () => { tw1?.kill(); tw2?.kill(); };
  }, [isActive]);

  /* ───────── render ───────── */
  return (
    <div
      ref={indicatorRef}
      className="scroll-indicator"
      role="status"
      aria-live="polite"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* FOTO – posouváme translateY podle window.innerHeight */}
      <img
        src="/mac-me.png"
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

      {/* šipka + text */}
      <div className="scroll-indicator__icon" ref={iconRef} aria-hidden="true">
        {arrowSvg}
      </div>
      <div
        className="scroll-indicator__text"
        ref={textRef}
        style={{ marginTop: "0.5rem" }}
      >
        {t(text)}
      </div>
    </div>
  );
};

export default ScrollIndicator;