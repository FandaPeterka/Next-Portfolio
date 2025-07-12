/* =========================================================
   ControlButtons.jsx – animace se NEspouští u vybraného tvaru
   ========================================================= */
"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

/* --------------------------------------------------------- */
/* 1.  Parametry & utils                                      */
/* --------------------------------------------------------- */
const HOVER_RADIUS = 30;                         // px – kdy “chytneme” hover

const SHAPES = {
  table: () => {
    const out = [];
    for (let r = -1; r <= 1; r++)
      for (let c = -1; c <= 1; c++) out.push({ x: c * 20, y: r * 20 });
    return out;
  },
  sphere: () => {
    const R = 25, ring = [];
    for (let i = 0; i < 8; i++) {
      const a = (2 * Math.PI * i) / 8;
      ring.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
    return [{ x: 0, y: 0 }, ...ring];
  },
  ring: () => {
    const R = 25, ring = [];
    for (let i = 0; i < 8; i++) {
      const a = (2 * Math.PI * i) / 8;
      ring.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
    return ring;
  }
};

const ARIA = {
  table : "Zobrazit rozložení tabulky",
  sphere: "Zobrazit rozložení koule",
  ring  : "Zobrazit rozložení kruhu",
};

const TO_LAYOUT = { table: "table", sphere: "sphere", ring: "helix" };

/* --------------------------------------------------------- */
/* 2.  Jedno kolečkové tlačítko                               */
/* --------------------------------------------------------- */
function AnimatedButton({ type, active, isTouch, onClick }) {
  const btn      = useRef(null);
  const dots     = useRef([]);
  const loops    = useRef([]);
  const shapePos = SHAPES[type]();

  const [hover, setHover] = useState(false);

  /* ―― sledování kurzoru (jen desktop) ――――――――――――――――――――――――― */
  useEffect(() => {
    if (isTouch || active) return;              // při výběru ani nehoveruje
    const move = (e) => {
      const r = btn.current?.getBoundingClientRect();
      if (!r) return;
      const d = Math.hypot(e.clientX - (r.left + r.width / 2),
                           e.clientY - (r.top  + r.height / 2));
      setHover(d <= HOVER_RADIUS);
    };
    document.addEventListener("mousemove", move, { passive: true });
    return () => document.removeEventListener("mousemove", move);
  }, [isTouch, active]);

  /* ―― smyčková animace při hoveru ――――――――――――――――――――――――――― */
  useEffect(() => {
    dots.current.forEach((dot, i) => {
      if (!dot) return;
      const { x, y } = shapePos[i];

      // kill případné staré animace
      loops.current[i]?.kill();
      loops.current[i] = null;

      // ► pokud je tlačítko aktivní, jen “zaparkuj” body a skonči
      if (active) {
        gsap.set(dot, { x, y, opacity: 1 });
        return;
      }

      // ► pokud hoverujeme, spustíme smyčku, jinak reset
      if (hover) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "power2.inOut" });
        tl.to(dot, { x: 0, y: 0, duration: 0.55 })
          .to(dot, { x, y, duration: 0.35 });
        loops.current[i] = tl;
      } else {
        gsap.to(dot, { x, y, duration: 0.45, ease: "power2.out" });
      }
    });
  }, [hover, active, shapePos]);

  /* ―― init pozice (po mountu) ――――――――――――――――――――――――――――― */
  useEffect(() => {
    dots.current.forEach((dot, i) => gsap.set(dot, shapePos[i]));
  }, [shapePos]);

  /* ―― úklid ――――――――――――――――――――――――――――――――――――――――――――― */
  useEffect(() => () => loops.current.forEach((tl) => tl?.kill()), []);

  /* ―― render ―――――――――――――――――――――――――――――――――――――――――――― */
  return (
    <button
      ref={btn}
      className={`animated-button${active ? " active" : ""}`}
      aria-label={ARIA[type]}
      onClick={onClick}
    >
      <div className="dots-container" style={{ position: "relative" }}>
        {shapePos.map((_, i) => (
          <div key={i} ref={(el) => (dots.current[i] = el)} className="dot" />
        ))}
      </div>
    </button>
  );
}

/* --------------------------------------------------------- */
/* 3.  Trojice tlačítek                                      */
/* --------------------------------------------------------- */
function ButtonGroup({ activeLayout, isTouch, onLayout }) {
  return (
    <>
      {["table", "sphere", "ring"].map((t) => (
        <AnimatedButton
          key={t}
          type={t}
          isTouch={isTouch}
          active={
            activeLayout === TO_LAYOUT[t] ||
            (t === "ring" && activeLayout === "helix")
          }
          onClick={() => onLayout(TO_LAYOUT[t])}
        />
      ))}
    </>
  );
}

/* --------------------------------------------------------- */
/* 4.  ControlButtons (export)                               */
/* --------------------------------------------------------- */
export default function ControlButtons({
  selectedTech,          // aktuálně vybraný card (index) | null
  activeLayout,          // "table" | "sphere" | "helix"
  isTouchDevice,         // prop z parent komponenty
  handleLayoutChange,    // fn
  handleRestart,         // fn
  resetSelection,        // fn
}) {
  return (
    <nav id="menu" aria-label="Ovládací prvky layoutu">
      {selectedTech === null ? (
        <div className="controls">
          <ButtonGroup
            activeLayout={activeLayout}
            isTouch={isTouchDevice}
            onLayout={handleLayoutChange}
          />
          <button
            onClick={handleRestart}
            className="restart-button"
            aria-label="Restart layoutu"
          >
            <div className="restart-icon">Restart</div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => resetSelection()}  /* šipka, event se nepředá */
          className="back-button"
          aria-label="Zpět"
        >
          <div className="back-icon">Back</div>
        </button>
      )}
    </nav>
  );
}