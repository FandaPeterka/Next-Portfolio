"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import config from "../../data/dataLedMatrix";
import { ledMatrixCache, loadImageAndGetData } from "./ledMatrixUtils";
const workerUrl = "/workers/LedMatrixWorker.js";
import useBlinkAnimation from "./useBlinkAnimation";
import "./LedMatrix.css";

function SingleLedMatrix({ configOverrides }) {
  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const [initialized, setInitialized] = useState(false);
  const [finalPixels, setFinalPixels] = useState([]);
  const [matrixWidth, setMatrixWidth] = useState(0);

  // Sloučená konfigurace
  const mergedConfig = useMemo(() => ({ ...config.global, ...configOverrides }), [config.global, configOverrides]);
  const { src, height, resolution, dotSize, gap, edgeThreshold, blurAmount } = mergedConfig;

  const [ledOnColor, setLedOnColor] = useState("#00ffff");
  const [ledOffColor, setLedOffColor] = useState("transparent");

  // Aktualizace barev LED dle aktuálního tématu
  useEffect(() => {
    const updateLEDColors = () => {
      const on = getComputedStyle(document.documentElement)
          .getPropertyValue("--led-on-color")
          .trim() || "#00ffff";
      const off = getComputedStyle(document.documentElement)
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

  // Vypočítáme klíč pro cache
  const cacheKey = useMemo(
    () => JSON.stringify({ src, height, resolution, blurAmount, edgeThreshold }),
    [src, height, resolution, blurAmount, edgeThreshold]
  );

  // Načítání image dat a zpracování pomocí web workeru
  useEffect(() => {
    if (ledMatrixCache.has(cacheKey)) {
      const { pixels, matrixWidth } = ledMatrixCache.get(cacheKey);
      setFinalPixels(pixels);
      setMatrixWidth(matrixWidth);
      return;
    }
    (async () => {
      try {
        const imageData = await loadImageAndGetData(src, height, resolution, blurAmount);
        const worker = new Worker(workerUrl);
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
  }, [cacheKey, src, height, resolution, blurAmount, edgeThreshold]);

  // Inicializace gridu – vykreslení LED diod do gridu
  useEffect(() => {
    if (!containerRef.current || !finalPixels.length) return;
    dotRefs.current = [];
    containerRef.current.innerHTML = "";
    finalPixels.forEach(() => {
      const dot = document.createElement("div");
      dot.className = "ledmatrix-dot";
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.backgroundColor = ledOffColor;
      containerRef.current.appendChild(dot);
      dotRefs.current.push(dot);
    });
    containerRef.current.style.display = "grid";
    containerRef.current.style.gridTemplateColumns = `repeat(${matrixWidth}, ${dotSize}px)`;
    containerRef.current.style.gridTemplateRows = `repeat(${height}, ${dotSize}px)`;
    containerRef.current.style.gap = `${gap}px`;
    setInitialized(true);
  }, [finalPixels, dotSize, ledOffColor, gap, matrixWidth, height]);

  // Blink animace pomocí custom hooku
  useBlinkAnimation(initialized, dotRefs, finalPixels, ledOnColor, ledOffColor);

  return (
    <div className="single-ledmatrix-container" role="img" aria-label="Dynamic LED Matrix Visualization" aria-hidden="true">
      <div className="ledmatrix-grid" ref={containerRef} />
    </div>
  );
}

export default SingleLedMatrix;