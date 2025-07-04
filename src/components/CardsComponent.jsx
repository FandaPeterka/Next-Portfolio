import React, { useState, useRef, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import dataCardsComponent from "../data/dataCardsComponent";
import PulsingLoop from "./PulsingLoop"; // Komponenta pro GSAP pulz, zachováno

function Card({ index, title, icon, description }) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  // Reference na element s kartou – GSAP jej bude natáčet
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: flipped ? 180 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [flipped]);

  return (
    <Tilt
      className="tilt-container"
      style={{ borderRadius: "20px", overflow: "hidden" }}
      glareEnable={true}
      glareMaxOpacity={0.45}
      glareColor="#ffffff"
      glarePosition="all"
      tiltMaxAngleX={25}
      tiltMaxAngleY={25}
      perspective={1000}
      transitionSpeed={450}
      scale={1.05}
    >
      <div className="perspective-container">
        {/* Klikací prvek karty – pouze onClick, bez alternativního ovládání */}
        <div
          ref={cardRef}
          onClick={() => setFlipped(!flipped)}
          className="flip-card"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Přední strana karty */}
          <div className="face-panel front-panel">
            <img
              src={icon}
              alt={t(title)}
              className="icon-image"
            />
            <h3 className="title-text">{t(title)}</h3>
          </div>
          {/* Zadní strana karty */}
          <div className="face-panel back-panel">
            <p className="description-text">{t(description)}</p>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

const CardsComponent = () => {
  return (
    <section className="passion-component">
      <ul className="cards-grid" role="list">
        {dataCardsComponent.map((card, index) => {
          // U první karty vykreslíme navíc PulsingLoop (obaleno uvnitř list item)
          if (index === 0) {
            return (
              <li
                key={`${card.title}-${index}`}
                role="listitem"
                style={{ position: "relative" }}
              >
                <PulsingLoop isOverlay={true} />
                <Card
                  index={index}
                  title={card.title}
                  icon={card.icon}
                  description={card.description}
                />
              </li>
            );
          }
          return (
            <li key={`${card.title}-${index}`} role="listitem">
              <Card
                index={index}
                title={card.title}
                icon={card.icon}
                description={card.description}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CardsComponent;