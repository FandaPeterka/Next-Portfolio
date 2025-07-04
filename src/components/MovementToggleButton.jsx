"use client";

import React, { useContext } from "react";
import { BiMove, BiBlock } from "react-icons/bi";
import { ThemeContext } from "../contexts/ThemeContext";

const LIGHT_THEMES = ["midnight-purple", "glacier-night", "mocha-space"];

/**
 * Vertikální přepínač pohybu kamery.
 * – zobrazuje se **pouze** na dotykových zařízeních (isTouchDevice === true)
 * – výška zkrácena: 80 px odsazení shora i zdola
 */
export default function MovementToggleButton({
  isMovementEnabled,
  toggleMovement,
  isTouchDevice,
}) {
  if (!isTouchDevice) return null; // PC / notebook → nic nevracej

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
        top: "80px",
        bottom: "80px",
        right: 0,
        width: "45px",
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