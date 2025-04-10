"use client";
import React, { useMemo } from "react";
import dataCardsComponent from "../../data/dataCardsComponent";
import Card from "./Card";
import PulsingLoop from "../PulsingLoop";
import "./CardsComponent.css";

const CardsComponent = () => {
  const renderedCards = useMemo(
    () =>
      dataCardsComponent.map((card, index) => {
        // U první karty zobrazíme také komponentu PulsingLoop
        if (index === 0) {
          return (
            <div key={`${card.title}-${index}`} style={{ position: "relative" }}>
              <PulsingLoop isOverlay={true} />
              <Card
                index={index}
                title={card.title}
                icon={card.icon}
                description={card.description}
              />
            </div>
          );
        }
        return (
          <Card
            key={`${card.title}-${index}`}
            index={index}
            title={card.title}
            icon={card.icon}
            description={card.description}
          />
        );
      }),
    []
  );

  return (
    // Obaleno do semantického elementu section s atributem aria-label
    <section className="passion-component" aria-label="Portfolio Cards Section">
      <div className="cards-grid">{renderedCards}</div>
    </section>
  );
};

export default CardsComponent;