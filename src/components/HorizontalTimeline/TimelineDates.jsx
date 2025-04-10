// TimelineDates.jsx
import React from "react";
import "./HorizontalTimeline.css";

const TimelineDates = ({ dates }) => {
  return (
    <div className="date-container" role="group" aria-label="Timeline Dates">
      {dates.map((date, index) => (
        <div key={index} className="experience-date">
          {date}
        </div>
      ))}
    </div>
  );
};

export default TimelineDates;