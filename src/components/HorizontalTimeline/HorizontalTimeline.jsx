"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import experiences from "../../data/dataHorizontalTimeline";
import TimelineIcons from "./TimelineIcons";
import TimelineDates from "./TimelineDates";
import TimelineOverlay from "./TimelineOverlay";
import TimelineDescription from "./TimelineDescription";
import useTimelineAnimation from "./useTimelineAnimation";
import "./HorizontalTimeline.css";

const HorizontalTimeline = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const iconRefs = useRef([]);
  const overlayRef = useRef(null);

  const [activeOverlay, setActiveOverlay] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  // Přidání elementů do refs
  const addToRefs = useCallback((el) => {
    if (el && !iconRefs.current.includes(el)) {
      iconRefs.current.push(el);
    }
  }, []);

  // Handler pro kliknutí na ikonu
  const handleIconClick = useCallback(
    (index) => {
      setShowDescription(false);
      if (!containerRef.current) return;

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
            setActiveOverlay({ index, rect: newRelativeRect });
          },
        });
      } else {
        setActiveOverlay({ index, rect: newRelativeRect });
      }
    },
    [activeOverlay]
  );

  // Přidání obsluhy klávesnice pro interaktivní ikony
  const handleIconKeyPress = useCallback(
    (e, index) => {
      if (e.key === "Enter" || e.key === " ") {
        handleIconClick(index);
      }
    },
    [handleIconClick]
  );

  // Nastavení výchozí aktivní ikony
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

  // Použití custom hooku pro animaci overlay a resize
  useTimelineAnimation(activeOverlay, containerRef, overlayRef, setShowDescription);

  // Výpočet pozice pro zobrazení popisu
  const computedTop = useMemo(() => {
    if (!activeOverlay) return 0;
    const { rect } = activeOverlay;
    return window.innerHeight / 2 - rect.height / 2 + rect.height * 2 + 20;
  }, [activeOverlay]);

  // Přeložení datumů pro serverovou komponentu TimelineDates
  const translatedDates = useMemo(() => experiences.map((exp) => t(exp.date)), [t]);

  // Přeložení dat pro popis aktivní položky pro TimelineDescription
  const descriptionData = useMemo(() => {
    if (!activeOverlay) return null;
    const exp = experiences[activeOverlay.index];
    return {
      name: t(exp.name),
      description: t(exp.description),
      skills: exp.skills ? exp.skills.map((skill) => t(skill)) : [],
    };
  }, [activeOverlay, t]);

  return (
    // Obaleno do semantického elementu <section> s aria-label pro časovou osu zkušeností
    <section className="horizontal-timeline-container" ref={containerRef} aria-label="Experience Timeline">
      <div ref={timelineRef} className="timeline-line"></div>

      <TimelineIcons
        experiences={experiences}
        activeIndex={activeOverlay ? activeOverlay.index : null}
        addToRefs={addToRefs}
        onIconClick={handleIconClick}
        onIconKeyPress={handleIconKeyPress}
      />

      <TimelineDates dates={translatedDates} />

      {activeOverlay && (
        <TimelineOverlay activeOverlay={activeOverlay} experiences={experiences} ref={overlayRef} />
      )}

      {activeOverlay && showDescription && descriptionData && (
        <TimelineDescription descriptionData={descriptionData} style={{ top: computedTop }} />
      )}
    </section>
  );
};

export default React.memo(HorizontalTimeline);