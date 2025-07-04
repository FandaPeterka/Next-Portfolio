"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import ScreenCanvas from "./ScreenCanvas";
import { projects } from "../data/dataProjectScreens";

const ProjectDescription = ({ project, reverse }) => {
  const { t } = useTranslation();
  const alignmentClass = reverse ? "text-right" : "text-left";
  return (
    <div className={`text-container project-description ${alignmentClass}`}>
      {/* Sekce: Název */}
      <div className="project-title-container">
        <h3>{t(project.name)}</h3>
      </div>
      {/* Sekce: Popis */}
      <div className="project-description-container">
        <p className="project-paragraph">{t(project.description)}</p>
      </div>
      {/* Sekce: Technologie */}
      <div className="project-technologies-container">
        {project.technologies.map((tech) => (
          <span key={tech} className="project-technology-tag">
            #{tech}
          </span>
        ))}
      </div>
      {/* Sekce: Ikony */}
      <div className="project-icons-container">
        {project.icons.map((icon, idx) => (
          <a
            key={idx}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={icon.src}
              alt={t(icon.alt)}
              style={{ width: "40px", height: "40px" }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

const ProjectScreens = () => {
  const { t } = useTranslation();
  return (
    <section
      className="project-screens-container"
      aria-label={t("Projects", "Projects")}
    >
      {projects.map((project, index) => {
        // Pro "reversed" projekty chceme na větších obrazovkách text napravo,
        // ale v DOM je screen vždy první.
        const reverse = index === 1;
        const containerClass = reverse
          ? "project-item row-reverse"
          : "project-item row";
        return (
          <article key={project.id} className={containerClass}>
            <div className="screen-container">
              <ScreenCanvas
                reverse={reverse}
                imageUrls={project.imageUrls}
                dimensions={project.dimensions}
              />
            </div>
            <div className="description-container">
              <ProjectDescription project={project} reverse={reverse} />
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default ProjectScreens;