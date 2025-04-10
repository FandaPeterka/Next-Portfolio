"use client";
import React from "react";
import AnimatedButtons from "./AnimatedButtons";
import "./ControlButtons.css";

const ControlButtons = React.memo(({ selectedTech, handleLayoutChange, handleRestart, resetSelection }) => {
  return (
    <div id="menu" role="region" aria-label="Control Buttons">
      {selectedTech === null ? (
        <div className="controls">
          <AnimatedButtons handleLayoutChange={handleLayoutChange} />
          <button onClick={handleRestart} className="restart-button" aria-label="Restart">
            <div className="restart-icon">Restart</div>
          </button>
        </div>
      ) : (
        <button onClick={resetSelection} className="back-button" aria-label="Back">
          <div className="back-icon">Back</div>
        </button>
      )}
    </div>
  );
});

export default ControlButtons;