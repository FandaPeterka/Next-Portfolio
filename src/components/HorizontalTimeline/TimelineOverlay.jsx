// TimelineOverlay.jsx
"use client";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import "./HorizontalTimeline.css";

const TimelineOverlay = forwardRef(({ activeOverlay, experiences }, ref) => {
  const { t } = useTranslation();
  if (!activeOverlay) return null;
  return (
    <div ref={ref} style={{ pointerEvents: "none" }}>
      <div className="overlay-wrapper" aria-hidden="true">
        <img src={experiences[activeOverlay.index].icon} alt={t(experiences[activeOverlay.index].title)} />
      </div>
    </div>
  );
});

export default TimelineOverlay;