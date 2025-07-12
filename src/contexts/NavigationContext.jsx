/* =========================================================
   NavigationContext – perzistence matrixEnabled
   ========================================================= */

"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export const NavigationContext = createContext();

/* --------------------------------------------------------- */
/* 1. Pomocná funkce – přečte počáteční hodnotu z LS         */
/* --------------------------------------------------------- */
const getInitialMatrixState = () => {
  if (typeof window === "undefined") return true;      // SSR fallback
  const saved = localStorage.getItem("matrixEnabled");
  return saved === null ? true : saved === "1";
};

/* --------------------------------------------------------- */
/* 2. Provider                                               */
/* --------------------------------------------------------- */
export default function NavigationProvider({ children }) {
  /* ―― stav sekcí / navigace ――――――――――――――――――――――――――――― */
  const [sections,          setSections]   = useState([]);
  const [activeSection,     setActive]     = useState(null);
  const [activeSectionIdx,  setActiveIdx]  = useState(0);

  /* ―― stav LED matice (s perzistencí) ―――――――――――――――――― */
  const [matrixEnabled, setMatrix]         = useState(getInitialMatrixState);

  const registerSections = useCallback((list) => setSections(list), []);

  const updateActive = useCallback((label, idx) => {
    setActive(label);
    setActiveIdx(idx);
  }, []);

  /* toggle + okamžitý zápis do LS */
  const toggleMatrix = useCallback(() => {
    setMatrix((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("matrixEnabled", next ? "1" : "0");
      }
      return next;
    });
  }, []);

  /* ―― synchronizace při změně z jiného tabu/okna ――――――― */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "matrixEnabled") {
        setMatrix(e.newValue === "1");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ―― zápis při mountu (pro případ, že LS neobsahoval klíč) ――― */
  useEffect(() => {
    localStorage.setItem("matrixEnabled", matrixEnabled ? "1" : "0");
  }, []); // jedno-ráz po mountu

  /* ----------------------------------------------------- */
  return (
    <NavigationContext.Provider
      value={{
        /* navigace */
        sections,
        registerSections,
        activeSection,
        activeSectionIdx,
        updateActive,
        /* LED matice */
        matrixEnabled,
        toggleMatrix,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}