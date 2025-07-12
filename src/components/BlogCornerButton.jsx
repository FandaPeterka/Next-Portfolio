/* =========================================================
   BlogCornerButton v5 – responzivní verze s adaptivní barvou textu
   ========================================================= */
"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { ThemeContext } from "@contexts/ThemeContext";

const LIGHT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];

export default function BlogCornerButton() {
  const { theme } = useContext(ThemeContext);
  const light     = LIGHT_THEMES.includes(theme);

  // Barvy
  const ACCENT    = "var(--bezel-color)";
  const BG_DARK   = "var(--color-bg-primary)";
  const BG_LIGHT  = "var(--color-bg-primary)";
  const TEXT_DARK = "#000000";
  const TEXT_LIGHT= "#ffffff";

  return (
    <Link
      href="/blog"
      aria-label="Přejít na blog"
      style={{
        "--size":   "clamp(120px, 20vw, 160px)",
        "--stroke": "clamp(3px, 0.5vw, 6px)",
        position:   "fixed",
        bottom:     0,
        left:       0,
        width:      "var(--size)",
        height:     "var(--size)",
        zIndex:     100,
        clipPath:   "polygon(0 100%, 0 0, 100% 100%)",
        background: light ? BG_LIGHT : BG_DARK,
        cursor:     "pointer",
      }}
    >
      {/* neonová přepona */}
      <span
        aria-hidden
        style={{
          position:        "absolute",
          top:             0,
          left:            0,
          width:           "calc(var(--size) * 1.414)",
          height:          "var(--stroke)",
          background:      ACCENT,
          boxShadow:       `0 0 12px 4px ${ACCENT}`,
          transformOrigin: "top left",
          transform:       "rotate(45deg)",
          pointerEvents:   "none",
        }}
      />

      {/* BLOG táhnoucí se podél přepony */}
      <span
        aria-hidden
        style={{
          position:        "absolute",
          top:             "calc(var(--size) * 0.45)",
          left:            "calc(var(--size) * 0.25)",
          transformOrigin: "top left",
          transform:       "rotate(45deg)",
          display:         "inline-block",
          color:           light ? TEXT_DARK : TEXT_LIGHT,
          fontFamily:      "'Poppins','Inter',sans-serif",
          fontWeight:      700,
          fontSize:        "clamp(1rem, 2.5vw, 1.4rem)",
          letterSpacing:   "0.1em",
          whiteSpace:      "nowrap",
          pointerEvents:   "none",
        }}
      >
        BLOG
      </span>
    </Link>
  );
}