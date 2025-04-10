import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectScreens.css";

const ProjectDescription = React.memo(({ project, alignmentClass }) => {
  const { t } = useTranslation();
  return (
    // Obalíme popis do sémantického elementu article se specifickým aria-label
    <article className="project-description" aria-label={`${t(project.name)} project details`}>
      {/* Sekce: Název */}
      <header className={`project-title-container ${alignmentClass}`}>
        <h3>{t(project.name)}</h3>
      </header>
      {/* Sekce: Popis */}
      <section className={`project-description-container ${alignmentClass}`}>
        <p className="project-paragraph">{t(project.description)}</p>
      </section>
      {/* Sekce: Technologie */}
      <section className={`project-technologies-container ${alignmentClass}`} aria-label="Project Technologies">
        <ul className="project-technologies-list">
          {project.technologies.map((tech) => (
            <li key={tech} className="project-technology-tag">
              #{tech}
            </li>
          ))}
        </ul>
      </section>
      {/* Sekce: Ikony */}
      <aside className={`project-icons-container ${alignmentClass}`} aria-label="Project Links">
        {project.icons.map((icon, idx) => (
          <a 
            key={idx} 
            href={icon.href} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={t(icon.alt)}
          >
            <img
              src={icon.src}
              alt={t(icon.alt)}
              style={{ width: "40px", height: "40px" }}
            />
          </a>
        ))}
      </aside>
    </article>
  );
});

export default ProjectDescription;