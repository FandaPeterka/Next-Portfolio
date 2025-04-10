"use client";
import React, { useMemo } from "react";
import Tilt from "react-parallax-tilt";
import "./Card.css";
import FlipCard from "./FlipCard";

const Card = ({ title, icon, description }) => {
  // Konfigurace možností pro Tilt, která se nemění při re-renderu
  const tiltOptions = useMemo(
    () => ({
      className: "tilt-container",
      style: { borderRadius: "20px", overflow: "hidden" },
      glareEnable: true,
      glareMaxOpacity: 0.45,
      glareColor: "#ffffff",
      glarePosition: "all",
      tiltMaxAngleX: 25,
      tiltMaxAngleY: 25,
      perspective: 1000,
      transitionSpeed: 450,
      scale: 1.05,
    }),
    []
  );

  return (
    <Tilt {...tiltOptions}>
      {/* Obaleno do semantického elementu article */}
      <article className="perspective-container" tabIndex="0">
        <FlipCard title={title} icon={icon} description={description} />
      </article>
    </Tilt>
  );
};

export default Card;