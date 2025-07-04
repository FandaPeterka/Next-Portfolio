"use client";

import React, { useRef, useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import Tech3DIcons from "@components/Tech3DIcons";
import LedMatrix from "@components/LedMatrix";
import ScrollIndicator from "@components/ScrollIndicator";
import CardsComponent from "@components/CardsComponent";
import HorizontalTimeline from "@components/HorizontalTimeline";
import ProjectScreens from "@components/ProjectScreens";
import ParticleNetwork from "@components/ParticleNetwork";
import Footer from "@components/Footer";
import appData from "@data/dataApp";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

/* ---------------- SectionHeading ---------------- */
const SectionHeading = ({ text, mb = "0.3rem" }) => {
  const r = useRef(null);

  useEffect(() => {
    // register only in the browser
    gsap.registerPlugin(ScrollTrigger);

    if (!r.current) return;
    gsap.fromTo(
      r.current,
      { x: -100, skewX: -8, opacity: 0 },
      {
        x: 0,
        skewX: 0,
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: r.current, start: "top 85%" },
      }
    );
  }, []);

  return (
    <h2
      ref={r}
      style={{
        fontFamily: "'Poppins','Inter',sans-serif",
        color: "var(--heading-color)",
        margin: `0 0 ${mb} 0`,
        fontSize: "clamp(1.8rem,3.8vw,2.6rem)",
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      {text}
    </h2>
  );
};

/* ---------------- Spacer ---------------- */
const Spacer = ({ h = "3rem" }) => <div aria-hidden style={{ height: h }} />;

/* =================================================================== */

export default function Home() {
  const { t } = useTranslation();

  const welcomeRef = useRef(null);
  const introductionRef = useRef(null);
  const techStackRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const [activeSection, setActiveSection] = useState(0);
  const [matrixEnabled, setMatrixEnabled] = useState(true);

  const sections = [
    { label: appData.sections[0].label, ref: welcomeRef },
    { label: appData.sections[1].label, ref: introductionRef },
    { label: appData.sections[2].label, ref: techStackRef },
    { label: appData.sections[3].label, ref: experienceRef },
    { label: appData.sections[4].label, ref: projectsRef },
    { label: appData.sections[5].label, ref: contactRef },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(() => {}, {
      rootMargin: "-80px 0px 0px 0px",
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    });
    sections.forEach(({ ref }) => ref.current && obs.observe(ref.current));

    const update = () => {
      let best = 0, min = Infinity;
      sections.forEach(({ ref }, idx) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          const d = Math.abs(rect.top + 80);
          if (d < min) { min = d; best = idx; }
        }
      });
      setActiveSection(best);
    };

    let tId;
    const onScroll = () => {
      clearTimeout(tId);
      tId = setTimeout(update, 120);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, [sections]);

  return (
    <div className="App">
      <Navbar
        sections={sections}
        activeSection={sections[activeSection].label}
        matrixEnabled={matrixEnabled}
        onToggleMatrix={() => setMatrixEnabled((s) => !s)}
      />

      {/* FIXED BACKGROUND */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }} aria-hidden>
        <LedMatrix activeSection={activeSection} showDots={matrixEnabled} />
      </div>

      {/* Welcome */}
      <div
        ref={welcomeRef}
        style={{
          marginTop: "clamp(0.5rem, 10vh, 2rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ScrollIndicator text={appData.scrollIndicatorText} />
      </div>

      <Spacer />

      {/* Intro */}
      <div ref={introductionRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[1].label)} />
        <CardsComponent />
      </div>

      <Spacer />

      {/* Tech */}
      <div ref={techStackRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[2].label)} mb="-5rem" />
        <Tech3DIcons />
      </div>

      <Spacer h="12rem" />

      {/* Experience */}
      <div ref={experienceRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[3].label)} />
        <HorizontalTimeline />
      </div>

      <Spacer h="3.5rem" />

      {/* Projects */}
      <div ref={projectsRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[4].label)} />
        <ProjectScreens />
      </div>

      <Spacer />

      {/* Contact */}
      <div ref={contactRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[5].label)} />
        <ParticleNetwork />
      </div>

      <Footer />
    </div>
  );
}