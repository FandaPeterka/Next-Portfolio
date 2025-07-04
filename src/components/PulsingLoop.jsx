import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

let hasPulsingLoopTriggeredGlobal = false;

const PulsingLoop = ({ isOverlay }) => {
  const containerRef = useRef(null);
  const pulseRefs = useRef([]);

  useEffect(() => {
    if (hasPulsingLoopTriggeredGlobal) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            obs.disconnect();
            hasPulsingLoopTriggeredGlobal = true;
            triggerPulses();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const triggerPulses = () => {
    let count = 0;

    const interval = setInterval(() => {
      if (count >= 3) {
        clearInterval(interval);
        // Po posledním pulzu nastavíme display: none místo state
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }, 500);
        return;
      }

      // Vytvoříme prvek, animujeme a nakonec odstraníme
      const pulse = document.createElement('div');
      pulse.className = 'gsap-pulse';
      pulse.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 4px solid white;
        transform: translate(-50%, -50%);
      `;
      containerRef.current.appendChild(pulse);
      pulseRefs.current.push(pulse);

      gsap.fromTo(
        pulse,
        { scale: 0, opacity: 1 },
        {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            containerRef.current.removeChild(pulse);
          }
        }
      );

      count++;
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: isOverlay ? 'absolute' : 'fixed',
        zIndex: 1000,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        pointerEvents: 'none',
      }}
    />
  );
};

export default PulsingLoop;