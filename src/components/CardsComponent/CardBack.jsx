import React from "react";
import "./Card.css";

const CardBack = ({ description }) => {
  return (
    <div className="face-panel back-panel">
      <p className="description-text">{description}</p>
    </div>
  );
};

export default CardBack;