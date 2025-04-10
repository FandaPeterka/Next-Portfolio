// hooks/useTimelineAnimation.js
"use client";
import { useEffect, useCallback } from "react";
import gsap from "gsap";

const useTimelineAnimation = (activeOverlay, containerRef, overlayRef, setShowDescription) => {
  const animateOverlay = useCallback(() => {
    if (activeOverlay && overlayRef.current && containerRef.current) {
      const { rect } = activeOverlay;
      gsap.set(overlayRef.current, {
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scale: 1,
        zIndex: 100,
      });
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
  }, [activeOverlay, containerRef, overlayRef, setShowDescription]);

  useEffect(() => {
    animateOverlay();
  }, [activeOverlay, animateOverlay]);

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
  }, [activeOverlay, containerRef, overlayRef]);
};

export default useTimelineAnimation;