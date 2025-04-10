"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ContactForm from "./ContactForm";
import "./ParticleNetwork.css";

const ParticleNetwork = () => {
  const containerRef = useRef(null);
  const [particlesStarted, setParticlesStarted] = useState(false);

  // Inicializace particles.js; konfigurace je statická.
  const initParticles = useCallback(() => {
    if (!window.particlesJS) return;
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 120,
            size: 8,
            duration: 0.6,
            opacity: 1,
            speed: 3,
            color: "#03ffff",
          },
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }, []);

  // Dynamické načtení skriptu particles.js; pokud již existuje, vrací resolve.
  const loadParticlesJsScript = useCallback(() => {
    const scriptId = "particles-js-script";
    if (document.getElementById(scriptId)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  }, []);

  // Observer callback, který spouští načtení skriptu a initParticles, pokud je kontejner v viewportu.
  const observerCallback = useCallback(
    async (entries, observer) => {
      for (let entry of entries) {
        if (entry.isIntersecting && !particlesStarted) {
          await loadParticlesJsScript();
          initParticles();
          setParticlesStarted(true);
          break; // Jakmile se skript načte a spustí, není třeba pokračovat.
        }
      }
    },
    [particlesStarted, loadParticlesJsScript, initParticles]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div className="container" ref={containerRef}>
      {/* Plátno pro particles.js */}
      <div id="particles-js" className="particles" aria-hidden="true"></div>

      {/* Overlay s kontaktním formulářem; přidáváme role="region" a popis pomocí aria-label */}
      <div className="overlay" role="region" aria-label="Contact Section">
        <ContactForm />
      </div>
    </div>
  );
};

export default React.memo(ParticleNetwork);