"use client";

import React, { useContext } from "react";
import { BiMove, BiBlock } from "react-icons/bi";
import { ThemeContext } from "../contexts/ThemeContext";

/* světlé motivy – potřebují černý text */
const LIGHT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];

/**
 * Zmenšené svislé tlačítko pro zapnutí / vypnutí pohybu kamery.
 * Nyní NEpokrývá celou výšku wrapperu – má pevný odsazení 60 px
 * od horního i dolního okraje komponenty.
 */
export default function MovementToggleButton({
  isMovementEnabled,
  toggleMovement,
}) {
  const { theme } = useContext(ThemeContext);
  const isLightTheme = LIGHT_THEMES.includes(theme);

  const fg = isLightTheme ? "#000" : "#fff";
  const bgVar = "var(--color-bg-primary)";
  const accentVar = "var(--bezel-color)";

  return (
    <button
      onClick={toggleMovement}
      style={{
        position: "absolute",
        top: "80px",      // 60 px od horního okraje
        bottom: "80px",   // 60 px od spodního okraje
        right: 0,
        width: "44px",    // úzké, ale stále klikatelné
        zIndex: 10,
        background: bgVar,
        color: fg,
        border: "none",
        borderLeft: `4px solid ${accentVar}`,
        borderRadius: "32px 0 0 32px",
        boxShadow: isMovementEnabled ? `0 0 12px ${accentVar}` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        cursor: "pointer",
        userSelect: "none",
        padding: 0,
      }}
      title={isMovementEnabled ? "Disable movement" : "Enable movement"}
    >
      {isMovementEnabled ? <BiMove size={24} /> : <BiBlock size={24} />}

      {/* vertikální popis */}
      <span
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        {isMovementEnabled ? "MOVE ON" : "MOVE OFF"}
      </span>
    </button>
  );
}