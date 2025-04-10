"use client";
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';

let hasFourDirectionalWavesTriggeredGlobal = false;

const FourDirectionalWaves = ({ isOverlay }) => {
  const containerRef = useRef(null);
  const hasTriggeredRef = useRef(hasFourDirectionalWavesTriggeredGlobal);
  const waveRefs = useRef([]);
  const pulseDuration = 2;

  const directions = useMemo(() => ([
    { x: 0, y: -100 },
    { x: 0, y: 100 },
    { x: -100, y: 0 },
    { x: 100, y: 0 }
  ]), []);

  const triggerPulse = useCallback((count = 0) => {
    if (count >= 2) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }, 1000);
      return;
    }

    waveRefs.current.forEach((ref, i) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { x: 0, y: 0, opacity: 0.7 },
          {
            x: directions[i].x,
            y: directions[i].y,
            opacity: 0,
            duration: pulseDuration,
            ease: 'power2.inOut',
            onComplete: () => {
              if (i === directions.length - 1) {
                triggerPulse(count + 1);
              }
            }
          }
        );
      }
    });
  }, [directions, pulseDuration]);

  useEffect(() => {
    if (hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            obs.disconnect();
            hasTriggeredRef.current = true;
            hasFourDirectionalWavesTriggeredGlobal = true;
            triggerPulse();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [triggerPulse]);

  const containerStyle = useMemo(() => ({
    position: isOverlay ? 'absolute' : 'fixed',
    zIndex: 1000,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 150,
    height: 150,
    pointerEvents: 'none'
  }), [isOverlay]);

  const dotStyle = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '4px solid white',
    transform: 'translate(-50%, -50%)',
  }), []);

  return (
    <div ref={containerRef} style={containerStyle} role="presentation" aria-hidden="true">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (waveRefs.current[i] = el)}
          style={dotStyle}
        />
      ))}
    </div>
  );
};

export default React.memo(FourDirectionalWaves);