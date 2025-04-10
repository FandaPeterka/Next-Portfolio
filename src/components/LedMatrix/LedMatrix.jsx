"use client";
import React, { useState, useEffect } from "react";
import config from "../../data/dataLedMatrix";
import SingleLedMatrix from "./SingleLedMatrix";
import "./LedMatrix.css";

export default function LedMatrix({ activeSection }) {
  const { images } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Vypočítáme aktuální index podle activeSection
    const nextIndex = activeSection % images.length;
    setCurrentIndex(nextIndex);
  }, [activeSection, images]);

  if (!images[currentIndex]) return null;

  return (
    <div
      className="ledmatrix-wrapper"
      role="img"
      aria-label="Dynamic LED Matrix Background"
      aria-hidden="true"
    >
      <SingleLedMatrix configOverrides={images[currentIndex]} />
    </div>
  );
}