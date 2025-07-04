"use client";

import React from "react";
import Tilt from "react-parallax-tilt";
import { useTranslation } from "react-i18next";

const TechCard = ({ tech, onClick, index, isSelected }) => {
  const { t } = useTranslation();

  return (
    <Tilt
      className="card-tilt"
      style={{ borderRadius: "20px", overflow: "hidden" }}
      glareEnable={true}
      glareMaxOpacity={0.45}
      glareColor="#ffffff"
      glarePosition="all"
      tiltMaxAngleX={25}
      tiltMaxAngleY={25}
      perspective={1000}
      transitionSpeed={450}
      scale={1}
    >
      <div className="card-container" onClick={onClick}>
        <div className="card">
          {tech.Svg ? (
            <tech.Svg className="card-icon" />
          ) : (
            <img
              src={tech.src}
              alt={t(tech.title)}
              className="card-icon"
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          )}
          <h3 className="card-title">{t(tech.title)}</h3>
        </div>
      </div>
    </Tilt>
  );
};

export default TechCard;