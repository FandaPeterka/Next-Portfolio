// useBlinkAnimation.js
"use client";
import { useEffect } from "react";

const useBlinkAnimation = (initialized, dotRefs, finalPixels, ledOnColor, ledOffColor) => {
  useEffect(() => {
    if (!initialized || !dotRefs.current.length) return;
    let blinkInterval;
    const startTime = Date.now();
    const doBlink = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed > 800) {
        clearInterval(blinkInterval);
        finalPixels.forEach((isOn, i) => {
          const dot = dotRefs.current[i];
          if (!dot) return;
          dot.style.backgroundColor = isOn ? ledOnColor : ledOffColor;
        });
        return;
      }
      const total = dotRefs.current.length;
      for (let i = 0; i < total; i++) {
        if (finalPixels[i] && Math.random() < 0.05) {
          const dot = dotRefs.current[i];
          const curr = dot.style.backgroundColor;
          dot.style.backgroundColor = curr === ledOnColor ? ledOffColor : ledOnColor;
        }
      }
    };
    blinkInterval = setInterval(doBlink, 150);
    return () => clearInterval(blinkInterval);
  }, [initialized, dotRefs, finalPixels, ledOnColor, ledOffColor]);
};

export default useBlinkAnimation;