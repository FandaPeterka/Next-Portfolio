"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import experiences from "../data/dataHorizontalTimeline";

const HorizontalTimeline = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const iconRefs = useRef([]);

  // Ukládáme do pole reference na ikony
  const addToRefs = (el) => {
    if (el && !iconRefs.current.includes(el)) {
      iconRefs.current.push(el);
    }
  };

  // Stav overlay – index ikony + její boundingRect
  const [activeOverlay, setActiveOverlay] = useState(null);
  const overlayRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false);

  // Klik na ikonu: spočítáme novou pozici overlay
  const handleIconClick = (index) => {
    setShowDescription(false); // schováme text, dokud animace neskončí
    if (!containerRef.current) return;

    // 1) Spočítáme boundingRect kontejneru a nové ikony
    const containerRect = containerRef.current.getBoundingClientRect();
    const newIconElem = iconRefs.current[index];
    if (!newIconElem) return;
    const newRect = newIconElem.getBoundingClientRect();
    const newRelativeRect = {
      left: newRect.left - containerRect.left,
      top: newRect.top - containerRect.top,
      width: newRect.width,
      height: newRect.height,
    };

    // 2) Pokud overlay již existuje, animujeme overlay zpět k původní ikoně => pak nastavíme overlay na novou ikonou
    if (activeOverlay) {
      const activeIconElem = iconRefs.current[activeOverlay.index];
      if (!activeIconElem) return;
      const activeRect = activeIconElem.getBoundingClientRect();
      const updatedActiveRect = {
        left: activeRect.left - containerRect.left,
        top: activeRect.top - containerRect.top,
        width: activeRect.width,
        height: activeRect.height,
      };
      gsap.to(overlayRef.current, {
        duration: 0.5,
        left: updatedActiveRect.left,
        top: updatedActiveRect.top,
        scale: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Po dokončení animace nastavíme overlay na novou ikonu
          setActiveOverlay({ index, rect: newRelativeRect });
        },
      });
    } else {
      // Pokud overlay ještě nebyl vybrán, nastavíme ho rovnou
      setActiveOverlay({ index, rect: newRelativeRect });
    }
  };

  // Klávesová navigace – alternativní přepínání mezi ikonami pomocí šipek vlevo / vpravo
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      // Pokud není aktivní žádná ikona, vybereme první
      const currentIndex = activeOverlay ? activeOverlay.index : 0;
      const newIndex = (currentIndex + 1) % experiences.length;
      handleIconClick(newIndex);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = activeOverlay ? activeOverlay.index : 0;
      const newIndex = currentIndex === 0 ? experiences.length - 1 : currentIndex - 1;
      handleIconClick(newIndex);
    }
  };

  // Při prvním renderu: vybereme 0. prvek jako default
  useEffect(() => {
    if (iconRefs.current[0] && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const rect = iconRefs.current[0].getBoundingClientRect();
      const relativeRect = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      };
      setActiveOverlay({ index: 0, rect: relativeRect });
    }
  }, []);

  // Kdykoli se změní activeOverlay, animujeme overlay do nového místa
  useEffect(() => {
    if (activeOverlay && overlayRef.current && containerRef.current) {
      const { rect } = activeOverlay;
      // Nastavíme overlay do původní velikosti a polohy
      gsap.set(overlayRef.current, {
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scale: 1,
        zIndex: 100,
      });
      // Animujeme overlay do středu kontejneru a zvětšíme (scale=2)
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetX = containerRect.width / 2 - rect.width / 2;
      const targetY = containerRect.height / 2 - rect.height / 2;
      gsap.to(overlayRef.current, {
        duration: 0.5,
        left: targetX,
        top: targetY,
        scale: 2,
        ease: "power2.out",
        onComplete: () => {
          setShowDescription(true);
        },
      });
    }
  }, [activeOverlay]);

  // Při resize okna: posuneme overlay do středu
  useEffect(() => {
    const handleResize = () => {
      if (activeOverlay && containerRef.current && overlayRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const { rect } = activeOverlay;
        const targetX = containerRect.width / 2 - rect.width / 2;
        const targetY = containerRect.height / 2 - rect.height / 2;
        gsap.to(overlayRef.current, {
          duration: 0.5,
          left: targetX,
          top: targetY,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeOverlay]);

  // Spočítáme top pro popis – text
  let computedTop = 0;
  if (activeOverlay) {
    const { rect } = activeOverlay;
    computedTop = window.innerHeight / 2 - rect.height / 2 + rect.height * 2 + 20;
  }

  return (
    <div
      className="horizontal-timeline-container"
      ref={containerRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div ref={timelineRef} className="timeline-line"></div>
      {/* Ikony */}
      <div className="icon-container">
        {experiences.map((exp, index) => (
          <div
            key={index}
            ref={addToRefs}
            onClick={() => handleIconClick(index)}
            className={`experience-icon ${
              activeOverlay && activeOverlay.index === index ? "active" : ""
            }`}
          >
            <img src={exp.icon} alt={t(exp.title)} />
          </div>
        ))}
      </div>
      {/* Datum */}
      <div className="date-container">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-date">
            {t(exp.date)}
          </div>
        ))}
      </div>

      {/* Overlay */}
      {activeOverlay && (
        <div ref={overlayRef} style={{ pointerEvents: "none" }}>
          <div className="overlay-wrapper">
            <img
              src={experiences[activeOverlay.index].icon}
              alt={t(experiences[activeOverlay.index].title)}
            />
          </div>
        </div>
      )}

      {/* Popis – text */}
      {activeOverlay && showDescription && (
        <div
          className="text-container description-text"
          style={{ top: computedTop, position: "absolute" }}
        >
          <h2>{t(experiences[activeOverlay.index].name)}</h2>
          <p>{t(experiences[activeOverlay.index].description)}</p>
          <div className="skills">
            {experiences[activeOverlay.index].skills &&
              experiences[activeOverlay.index].skills.map((skill, i) => (
                <span key={i} className="skill">
                  {t(skill)}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalTimeline;