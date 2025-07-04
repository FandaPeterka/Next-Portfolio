"use client";

import React, {
  useContext, useEffect, useState, useCallback,
} from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/* ────────── motivy ────────── */
const THEMES = [
  { name: "elegant-slate",   color: "#6c8ebf" },
  { name: "forest-dawn",     color: "#689f38" },
  { name: "sandstorm",       color: "#c3986b" },
  { name: "midnight-purple", color: "#8e44ad" },
  { name: "glacier-night",   color: "#4a90e2" },
  { name: "mocha-space",     color: "#b56737" },
];

const DOT_DESKTOP = 12;
const DOT_MOBILE  = 36;

export default function ThemeToggle() {
  const { theme, changeTheme } = useContext(ThemeContext);

  /* ­breakpoint */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* dropdown (mobile) */
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  /* ---------------- DESKTOP ---------------- */
  if (!isMobile) {
    return (
      <div className="theme-toggle" style={{ display: "flex", gap: 6 }}>
        {THEMES.map(({ name, color }) => (
          <div
            key={name}
            className={`theme-toggle-dot ${theme === name ? "active" : ""}`}
            style={{
              width:  DOT_DESKTOP,
              height: DOT_DESKTOP,
              borderRadius: "50%",
              backgroundColor: theme === name ? color : "#b0b0b0",
              boxShadow: theme === name ? `0 0 6px 3px ${color}` : "none",
              cursor: "pointer",
            }}
            onClick={() => {
              changeTheme(name);
              window.dispatchEvent(new Event("theme-changed"));
            }}
          />
        ))}
      </div>
    );
  }

  /* ------------- MOBILE ------------- */
  const current = THEMES.find((t) => t.name === theme) || THEMES[0];

  return (
    <div style={{ position: "relative" }}>
      {/* velký puntík aktuálního motivu */}
      <button
        type="button"
        aria-label="Select colour theme"
        onClick={toggleOpen}
        style={{
          width:  DOT_MOBILE,
          height: DOT_MOBILE,
          borderRadius: "50%",
          border: "none",
          background: current.color,
          boxShadow: `0 0 8px 4px ${current.color}`,
          cursor: "pointer",
        }}
      />

      {/* dropdown paleta */}
      {open && (
        <div className="theme-dropdown mobile" role="menu">
          {THEMES.map(({ name, color }) => {
            const active = theme === name;
            return (
              <button
                key={name}
                aria-label={`Theme ${name}`}
                onClick={() => {
                  changeTheme(name);
                  window.dispatchEvent(new Event("theme-changed"));
                  setOpen(false);
                }}
                style={{
                  width:  DOT_MOBILE,
                  height: DOT_MOBILE,
                  borderRadius: "50%",
                  border: active ? "none" : `4px solid ${color}`,
                  backgroundColor: active ? color : "#b0b0b0",
                  boxShadow: active
                    ? `0 0 8px 4px ${color}`
                    : `0 0 4px 1px ${color}55`,
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}