import React, { useMemo } from "react";
import ScreenCanvas from "./ScreenCanvas";
import ProjectDescription from "./ProjectDescription";
import "./ProjectScreens.css";

const ProjectItem = React.memo(({ project, reverse }) => {
  // Vypočítáme orientační třídu pro text
  const alignmentClass = useMemo(
    () => (reverse ? "text-right" : "text-left"),
    [reverse]
  );
  // Nastavujeme CSS třídu projektu, abychom mohli měnit orientaci položky
  const containerClass = reverse ? "project-item row-reverse" : "project-item row";

  return (
    // Obalíme každý projekt do article
    <article className={containerClass} aria-label={`Project ${project.name}`}>
      <div className="screen-container">
        <ScreenCanvas
          reverse={reverse}
          imageUrls={project.imageUrls}
          dimensions={project.dimensions}
        />
      </div>
      <div className="description-container">
        <ProjectDescription project={project} alignmentClass={alignmentClass} />
      </div>
    </article>
  );
});

export default ProjectItem;