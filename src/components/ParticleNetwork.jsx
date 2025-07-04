"use client";
import React, { useEffect, useRef, useState } from "react";
import ContactForm from "./ContactForm";

export default function ParticleNetwork() {
  const containerRef = useRef(null);
  const [particlesStarted, setParticlesStarted] = useState(false);

  // Spouští particles.js, pokud dosud nebylo spuštěno
  function initParticles() {
    if (!window.particlesJS) return;
    // Jednou
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
  }

  // Dynamicky přidáme <script src="particles.min.js"> jednou
  function loadParticlesJsScript() {
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
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting && !particlesStarted) {
            // 1) Načteme script (pokud ještě není)
            await loadParticlesJsScript();
            // 2) Spustíme init jen jednou
            initParticles();
            // 3) Nastavíme do state => spouštíme jen jednou
            setParticlesStarted(true);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [particlesStarted]);

  return (
    <div className="container" ref={containerRef}>
      {/* Plátno pro particles.js – dekorativní prvek skrytý před asistenčními technologiemi */}
      <div
        id="particles-js"
        className="particles"
        aria-hidden="true"
        role="presentation"
      ></div>

      {/* Overlay s kontaktním formulářem */}
      <div className="overlay">
        <ContactForm />
      </div>
    </div>
  );
}