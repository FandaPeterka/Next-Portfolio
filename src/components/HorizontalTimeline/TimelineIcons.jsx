// TimelineIcons.jsx
"use client";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./HorizontalTimeline.css";

const TimelineIcons = ({ experiences, activeIndex, addToRefs, onIconClick, onIconKeyPress }) => {
  const { t } = useTranslation();
  const renderedIcons = useMemo(
    () =>
      experiences.map((exp, index) => (
        <div
          key={index}
          ref={addToRefs}
          onClick={() => onIconClick(index)}
          onKeyPress={(e) => onIconKeyPress(e, index)}
          className={`experience-icon ${activeIndex === index ? "active" : ""}`}
          role="button"
          tabIndex="0"
          aria-label={t(exp.title)}
        >
          <img src={exp.icon} alt={t(exp.title)} />
        </div>
      )),
    [experiences, activeIndex, addToRefs, onIconClick, onIconKeyPress, t]
  );
  return <div className="icon-container">{renderedIcons}</div>;
};

export default TimelineIcons;