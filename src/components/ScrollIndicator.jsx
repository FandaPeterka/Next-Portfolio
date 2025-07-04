import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import scrollIndicatorData from "../data/dataScrollIndicator";

const ScrollIndicator = ({ text = scrollIndicatorData.defaultText }) => {
  const { t } = useTranslation();
  const indicatorRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const arrowSvg = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ), []);

  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        window.dispatchEvent(new CustomEvent("scroll-indicator", { detail: { text } }));
      } else {
        setIsVisible(false);
      }
    });
  }, [text]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    if (indicatorRef.current) observer.observe(indicatorRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  useEffect(() => {
    if (isVisible && iconRef.current && textRef.current) {
      gsap.to(iconRef.current, {
        y: 15,
        duration: 0.75,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
      gsap.to(textRef.current, {
        opacity: 0,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={indicatorRef}
      className="scroll-indicator"
      role="status"
      aria-live="polite"
    >
      {isVisible && (
        <>
          <div className="scroll-indicator__icon" ref={iconRef} aria-hidden="true">
            {arrowSvg}
          </div>
          <div className="scroll-indicator__text" ref={textRef}>
            {t(text)}
          </div>
        </>
      )}
    </div>
  );
};

export default ScrollIndicator;