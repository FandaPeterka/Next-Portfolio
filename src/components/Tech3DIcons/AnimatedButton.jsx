"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import gsap from "gsap";
import "./ControlButtons.css";

const THRESHOLD = 80; // Vzdálenost v pixelech, při které se animace vypne

function getTargetShape(type) {
  if (type === "table") {
    const positions = [];
    const spacing = 20;
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        positions.push({ x: col * spacing, y: row * spacing });
      }
    }
    return positions;
  } else if (type === "sphere") {
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
  return getTargetShape("table");
}

const AnimatedButton = React.memo(({ type, onClick }) => {
  const buttonRef = useRef(null);
  const dotRefs = useRef([]);
  const shapePositions = useMemo(() => getTargetShape(type), [type]);
  const dotCount = shapePositions.length;
  const dotsArray = useMemo(() => Array.from({ length: dotCount }, (_, i) => i), [dotCount]);
  const [isHovered, setIsHovered] = useState(false);
  const hoverAnimations = useRef([]);

  useEffect(() => {
    if (!dotRefs.current.length) return;
    if (isHovered) {
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
      dotRefs.current.forEach((dot, i) => {
        if (hoverAnimations.current[i]) {
          hoverAnimations.current[i].kill();
        }
        gsap.set(dot, { x: shapePositions[i].x, y: shapePositions[i].y, opacity: 1 });
      });
    }
  }, [isHovered, shapePositions]);

  const handleMouseMove = useCallback((e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    setIsHovered(distance <= THRESHOLD);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, { passive: true });
    };
  }, [handleMouseMove]);

  return (
    <button 
      ref={buttonRef} 
      className="animated-button" 
      onClick={onClick}
      aria-label="Animated control button"
    >
      <div className="dots-container" style={{ position: "relative" }} aria-hidden="true">
        {dotsArray.map((_, i) => (
          <div key={i} ref={(el) => (dotRefs.current[i] = el)} className="dot" />
        ))}
      </div>
    </button>
  );
});

export default AnimatedButton;