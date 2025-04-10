"use client";
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';

let hasPulsingLoopTriggeredGlobal = false;

const PulsingLoop = ({ isOverlay }) => {
  const containerRef = useRef(null);
  const pulseRefs = useRef([]);

  const triggerPulses = useCallback(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        }, 500);
        return;
      }
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
      if (containerRef.current) {
        containerRef.current.appendChild(pulse);
        pulseRefs.current.push(pulse);
      }
      gsap.fromTo(
        pulse,
        { scale: 0, opacity: 1 },
        {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.removeChild(pulse);
            }
          }
        }
      );
      count++;
    }, 500);
  }, []);

  const observerCallback = useCallback((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasPulsingLoopTriggeredGlobal) {
        observer.disconnect();
        hasPulsingLoopTriggeredGlobal = true;
        triggerPulses();
      }
    });
  }, [triggerPulses]);

  useEffect(() => {
    if (hasPulsingLoopTriggeredGlobal) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [observerCallback]);

  const containerStyle = useMemo(() => ({
    position: isOverlay ? 'absolute' : 'fixed',
    zIndex: 1000,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120px',
    height: '120px',
    pointerEvents: 'none',
  }), [isOverlay]);

  return (
    <div ref={containerRef} style={containerStyle} role="presentation" aria-hidden="true" />
  );
};

export default React.memo(PulsingLoop);