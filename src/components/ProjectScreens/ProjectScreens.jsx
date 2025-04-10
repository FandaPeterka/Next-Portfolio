import React, { useMemo } from "react";
import ProjectItem from "./ProjectItem";
import "./ProjectScreens.css";
import { projects } from "../../data/dataProjectScreens";

const ProjectScreens = React.memo(() => {
  // Vykreslíme projektové položky – projekty jsou statická data
  const projectItems = useMemo(() => {
    return projects.map((project, index) => {
      // Pro příklad: pro druhý projekt (index === 1) použijeme reverse layout
      const reverse = index === 1;
      return <ProjectItem key={project.id} project={project} reverse={reverse} />;
    });
  }, []);

  return (
    <section className="project-screens-container" aria-label="Projects Portfolio">
      {projectItems}
    </section>
  );
});

export default ProjectScreens;