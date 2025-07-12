"use client";
import React, { useContext } from "react";
import LedMatrix from "@components/LedMatrix";
import { NavigationContext } from "@contexts/NavigationContext";

/** Jediná (globální) instance LED-matice */
export default function MatrixBackground() {
  const { activeSectionIdx, matrixEnabled } = useContext(NavigationContext);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }} aria-hidden>
      <LedMatrix activeSection={activeSectionIdx} showDots={matrixEnabled} />
    </div>
  );
}