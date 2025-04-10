// app/page.jsx
"use client";  // Protože váš kód pracuje s DOMem (scroll, useEffect apod.)
import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Tech3DIcons from '../components/Tech3DIcons/Tech3DIcons';
import LedMatrix from '../components/LedMatrix/LedMatrix';
import ScrollIndicator from '@components/ScrollIndicator';
import CardsComponent from '../components/CardsComponent/CardsComponent';
import HorizontalTimeline from '../components/HorizontalTimeline/HorizontalTimeline';
import ProjectScreens from '../components/ProjectScreens/ProjectScreens';
import ParticleNetwork from '../components/ContactForm/ParticleNetwork';
import Footer from '../components/Footer/Footer';
import appData from '@data/dataApp';  // Ujistěte se, že máte správně nastaven import alias
// Globální styly jsou importovány v layout.jsx, nemusíte importovat Theme.css zde

export default function Home() {
  // Vytvoříme reference pro jednotlivé sekce
  const welcomeRef = useRef(null);
  const introductionRef = useRef(null);
  const techStackRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  // Použijeme data z dataApp pro vytvoření sekcí
  const sections = [
    { label: appData.sections[0].label, ref: welcomeRef },
    { label: appData.sections[1].label, ref: introductionRef },
    { label: appData.sections[2].label, ref: techStackRef },
    { label: appData.sections[3].label, ref: experienceRef },
    { label: appData.sections[4].label, ref: projectsRef },
    { label: appData.sections[5].label, ref: contactRef },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px 0px 0px', // kompenzace pro fixní navbar
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    };
  
    const observerCallback = (entries) => {
      // Tento callback nemusí měnit activeSection během scrollu – aktualizace provedeme po ukončení scrollu.
    };
  
    const observer = new IntersectionObserver(observerCallback, observerOptions);
  
    const attachObserver = () => {
      sections.forEach(({ ref }, index) => {
        if (ref.current) {
          ref.current.setAttribute('data-index', index);
          observer.observe(ref.current);
        }
      });
    };
  
    attachObserver();
  
    const updateActiveSection = () => {
      let activeIdx = 0;
      let minDiff = Infinity;
      sections.forEach(({ ref }, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const diff = Math.abs(rect.top + 80); // 80 px = výška navbaru
          if (diff < minDiff) {
            minDiff = diff;
            activeIdx = index;
          }
        }
      });
      setActiveSection(activeIdx);
    };
  
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateActiveSection();
      }, 200);
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [sections]);

  return (
    <div className="App">
      {/* Navigační panel */}
      <Navbar sections={sections} activeSection={activeSection} />

      {/* LedMatrix jako podkladová komponenta */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
        }}
      >
        <LedMatrix activeSection={activeSection} />
      </div>

      <div ref={welcomeRef} style={{ marginTop: '5rem', position: 'relative', zIndex: 1 }}>
        <ScrollIndicator text={appData.scrollIndicatorText} />
      </div>

      <div ref={introductionRef} style={{ position: 'relative', zIndex: 2 }}>
        <CardsComponent />
      </div>

      <div ref={techStackRef} style={{ position: 'relative', zIndex: 2 }}>
        <Tech3DIcons />
      </div>

      <div ref={experienceRef} style={{ position: 'relative', zIndex: 2 }}>
        <HorizontalTimeline />
      </div>

      <div ref={projectsRef} style={{ position: 'relative', zIndex: 2 }}>
        <ProjectScreens />
      </div>

      <div ref={contactRef} style={{ position: 'relative', zIndex: 2 }}>
        <ParticleNetwork />
      </div>

      <Footer />
    </div>
  );
}