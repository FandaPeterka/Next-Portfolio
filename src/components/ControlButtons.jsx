"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const THRESHOLD = 80; // Vzdálenost v pixelech, při které se animace teprve vypne

// Více zřejmé tvary:
// - TABULKA = 3x3 s většími mezerami (20 => spacing v příkladu níže)
// - SPHERE = střed + 8 teček kolem v poloměru 25
// - RING = 8 teček v poloměru 25
function getTargetShape(type) {
  if (type === "table") {
    // 3x3
    const positions = [];
    const spacing = 20;
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        positions.push({ x: col * spacing, y: row * spacing });
      }
    }
    return positions;
  } else if (type === "sphere") {
    // středová tečka + 8 do kruhu (radius 25)
    const ring = [];
    const radius = 25;
    for (let i = 0; i < 8; i++) {
      const angle = (2 * Math.PI * i) / 8;
      ring.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }
    return [{ x: 0, y: 0 }, ...ring];
  } else if (type === "ring") {
    // 8 teček v kruhu (radius 25), žádná středová
    const ring = [];
    const radius = 25;
    for (let i = 0; i < 8; i++) {
      const angle = (2 * Math.PI * i) / 8;
      ring.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }
    return ring;
  }
  // fallback
  return getTargetShape("table");
}

// Pomocná funkce pro generování popisku tlačítka (aria-label)
const getAriaLabel = (type) => {
  switch (type) {
    case "table":
      return "Zobrazit rozložení tabulky";
    case "sphere":
      return "Zobrazit rozložení koule";
    case "ring":
      return "Zobrazit rozložení kruhu";
    default:
      return "Změnit rozložení";
  }
};

function AnimatedButton({ type, onClick }) {
  const buttonRef = useRef(null);
  const dotRefs = useRef([]); // Refs na jednotlivé tečky
  const shapePositions = getTargetShape(type);
  const [isHovered, setIsHovered] = useState(false);

  // Vytvoříme 1 div pro každou tečku podle shapePositions
  const dotCount = shapePositions.length;
  const dotsArray = Array.from({ length: dotCount }, (_, i) => i);

  // GSAP timeline(s)
  const hoverAnimations = useRef([]); // Uloží timeline/animaci pro jednotlivé tečky

  useEffect(() => {
    if (!dotRefs.current.length) return;

    if (isHovered) {
      // Spustíme animaci pro každou tečku: 0,0 => shape => shape => 0,0
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        if (hoverAnimations.current[i]) {
          hoverAnimations.current[i].kill();
        }
        const { x, y } = shapePositions[i];
        const tl = gsap.timeline();
        tl.set(dot, { x: 0, y: 0, opacity: 0 });
        tl.to(dot, {
          x,
          y,
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
          delay: i * 0.1,
        });
        tl.to(dot, { duration: 0.1 });
        tl.to(dot, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });
        hoverAnimations.current[i] = tl;
      });
    } else {
      // Resetujeme tečky na původní pozice
      dotRefs.current.forEach((dot, i) => {
        if (hoverAnimations.current[i]) {
          hoverAnimations.current[i].kill();
        }
        gsap.set(dot, { x: shapePositions[i].x, y: shapePositions[i].y, opacity: 1 });
      });
    }
  }, [isHovered, shapePositions]);

  // Sledujeme kurzor – pokud je v definované vzdálenosti, nastavíme isHovered = true
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= THRESHOLD) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <button
      ref={buttonRef}
      className="animated-button"
      onClick={onClick}
      aria-label={getAriaLabel(type)}
    >
      <div className="dots-container" style={{ position: "relative" }}>
        {dotsArray.map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotRefs.current[i] = el)}
            className="dot"
          />
        ))}
      </div>
    </button>
  );
}

function AnimatedButtons({ handleLayoutChange }) {
  return (
    <>
      <AnimatedButton type="table" onClick={() => handleLayoutChange("table")} />
      <AnimatedButton type="sphere" onClick={() => handleLayoutChange("sphere")} />
      <AnimatedButton type="ring" onClick={() => handleLayoutChange("helix")} />
    </>
  );
}

export default function ControlButtons({
  selectedTech,
  handleLayoutChange,
  handleRestart,
  resetSelection,
}) {
  return (
    <nav id="menu" aria-label="Ovládací prvky layoutu">
      {selectedTech === null ? (
        <div className="controls">
          <AnimatedButtons handleLayoutChange={handleLayoutChange} />
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
          onClick={() => resetSelection()}
          className="back-button"
          aria-label="Zpět"
        >
          <div className="back-icon">Back</div>
        </button>
      )}
    </nav>
  );
}