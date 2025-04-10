"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import "./Card.css";

const FlipCard = ({ title, icon, description }) => {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Přepínač stavu karty
  const toggleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  // GSAP animace při změně stavu
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: flipped ? 180 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [flipped]);

  return (
    <div
      ref={cardRef}
      onClick={toggleFlip}
      className="flip-card"
      role="button"
      aria-pressed={flipped}
      tabIndex="0"
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardFront title={t(title)} icon={icon} />
      <CardBack description={t(description)} />
    </div>
  );
};

export default FlipCard;