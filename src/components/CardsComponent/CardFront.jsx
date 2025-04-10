import React from "react";
import "./Card.css";

const CardFront = ({ title, icon }) => {
  return (
    // Používáme semantický prvek figure pro zobrazení obrázku a titulku
    <figure className="face-panel front-panel">
      <img src={icon} alt={title} className="icon-image" />
      <figcaption>
        <h3 className="title-text">{title}</h3>
      </figcaption>
    </figure>
  );
};

export default CardFront;