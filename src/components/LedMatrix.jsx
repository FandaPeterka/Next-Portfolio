"use client"; // Klientský kód v Next.js

import React, { useEffect, useState, useRef } from "react";
import config from "../data/dataLedMatrix";

// Cache pro výsledky LED matice
const ledMatrixCache = new Map();

async function loadImageAndGetData(imgSrc, height, resolution, blurAmount) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const aspect = img.width / img.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = height * resolution;
      canvas.width = canvas.height * aspect;
      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    img.onerror = (err) => reject(err);
  });
}

function SingleLedMatrix({ configOverrides }) {
  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const [initialized, setInitialized] = useState(false);
  const [finalPixels, setFinalPixels] = useState([]);
  const [matrixWidth, setMatrixWidth] = useState(0);

  const mergedConfig = { ...config.global, ...configOverrides };
  const { src, height, resolution, dotSize, gap, edgeThreshold, blurAmount } = mergedConfig;

  const [ledOnColor, setLedOnColor] = useState("#00ffff");
  const [ledOffColor, setLedOffColor] = useState("transparent");

  useEffect(() => {
    const updateLEDColors = () => {
      const on =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--led-on-color")
          .trim() || "#00ffff";
      const off =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--led-off-color")
          .trim() || "transparent";
      setLedOnColor(on);
      setLedOffColor(off);
    };
    updateLEDColors();
    const obs = new MutationObserver(updateLEDColors);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cacheKey = JSON.stringify({ src, height, resolution, blurAmount, edgeThreshold });
    if (ledMatrixCache.has(cacheKey)) {
      const { pixels, matrixWidth } = ledMatrixCache.get(cacheKey);
      setFinalPixels(pixels);
      setMatrixWidth(matrixWidth);
      return;
    }

    (async () => {
      try {
        const imageData = await loadImageAndGetData(src, height, resolution, blurAmount);
        // Vytvoříme instanci workeru s URL odpovídající umístění ve veřejné složce
        const worker = new Worker("/workers/LedMatrixWorker.js", { type: "module" });
        worker.onmessage = (e) => {
          const { pixels, width: w } = e.data;
          ledMatrixCache.set(cacheKey, { pixels, matrixWidth: w });
          setFinalPixels(pixels);
          setMatrixWidth(w);
          worker.terminate();
        };
        worker.postMessage({ imageData, resolution, edgeThreshold });
      } catch (err) {
        console.error("Load image error:", err);
      }
    })();
  }, [src, height, resolution, blurAmount, edgeThreshold]);

  useEffect(() => {
    if (!containerRef.current || !finalPixels.length) return;
    dotRefs.current = [];
    containerRef.current.innerHTML = "";

    finalPixels.forEach(() => {
      const dot = document.createElement("div");
      dot.className = "ledmatrix-dot";
      dot.style.width = dotSize + "px";
      dot.style.height = dotSize + "px";
      dot.style.backgroundColor = ledOffColor;
      containerRef.current.appendChild(dot);
      dotRefs.current.push(dot);
    });

    containerRef.current.style.display = "grid";
    containerRef.current.style.gridTemplateColumns = `repeat(${matrixWidth}, ${dotSize}px)`;
    containerRef.current.style.gridTemplateRows = `repeat(${height}, ${dotSize}px)`;
    containerRef.current.style.gap = gap + "px";

    setInitialized(true);
  }, [finalPixels, dotSize, ledOffColor, gap, matrixWidth, height]);

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
          dot.style.backgroundColor = (curr === ledOnColor) ? ledOffColor : ledOnColor;
        }
      }
    };

    blinkInterval = setInterval(doBlink, 150);
    return () => clearInterval(blinkInterval);
  }, [initialized, finalPixels, ledOnColor, ledOffColor]);

  return (
    <div className="single-ledmatrix-container" aria-hidden="true">
      <div className="ledmatrix-grid" ref={containerRef} aria-hidden="true" />
    </div>
  );
}

export default function LedMatrix({ activeSection }) {
  const { images } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const nextIndex = activeSection % images.length;
    setCurrentIndex(nextIndex);
  }, [activeSection, images]);

  if (!images[currentIndex]) return null;

  return (
    <div className="ledmatrix-wrapper" aria-hidden="true">
      <SingleLedMatrix configOverrides={images[currentIndex]} />
    </div>
  );
}