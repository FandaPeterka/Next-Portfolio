import React from "react";
import "./Tech3DIcons.css";

const StaticDescription = ({ title, description }) => {
  return (
    <section aria-label="Project description">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

export default StaticDescription;