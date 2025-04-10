// TimelineDescription.jsx
import React from "react";
import "./HorizontalTimeline.css";

const TimelineDescription = ({ descriptionData, style }) => {
  if (!descriptionData) return null;
  return (
    <article className="description-text" style={style} aria-label="Experience Description">
      <h2>{descriptionData.name}</h2>
      <p>{descriptionData.description}</p>
      {descriptionData.skills && (
        <div className="skills" role="list" aria-label="Skills">
          {descriptionData.skills.map((skill, i) => (
            <span key={i} className="skill" role="listitem">
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default TimelineDescription;